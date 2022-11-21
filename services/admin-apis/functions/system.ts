import { APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context } from "aws-lambda";
import { apiResponse, badRequest, forbidden, internalServer } from "@lib/response";
import { UserRoles } from "@/constants";
import { ICognitoUser } from "@interfaces/user";
import { requestValidator, SchemaName } from "@lib/validator/validator";
import { SystemService } from "@/dbTransactions/system-service";
import { authWrapper } from "@lib/authWrapper";
import { isStringNonNull } from "@lib/utility";
import { UserService } from "@/dbTransactions/user-service";
import { mapSystemResponse } from "@lib/response-map/system";
import { System } from "@db/entities/System";

const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION
});
const ARN_CERT = 'arn:aws:iot:us-west-2:233953772612:cert/3425ef924c500b8d39f5d1852a09bab0468e90af6c54c2078fa0e94fc2c4e8a5';

export const getSystemsHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    let buildingId = event.queryStringParameters && event.queryStringParameters.buildingId;
    let page = event.queryStringParameters && event.queryStringParameters.page;
    let street = event.queryStringParameters && event.queryStringParameters.street;
    let city = event.queryStringParameters && event.queryStringParameters.city;
    let userId = event.queryStringParameters && event.queryStringParameters.userId;
    let assign = event.queryStringParameters && event.queryStringParameters.assign;
    let order = event.queryStringParameters && event.queryStringParameters.order;
    let column = event.queryStringParameters && event.queryStringParameters.column;
    let assign_mode = isStringNonNull(assign) ? assign == "true" : false;

    /*
    ADMIN:
      getAllSystems
      getSystemsByUsername
      getSystemsByBuilding
    TECH, User:
      getSystemsForUser
    */
    try {
      let data: {};
      if (user.role != UserRoles.ADMIN) {
        data = await SystemService.getSystems(page, null, null, user.sub, assign_mode, street, city, order, column);
      } else {
        data = await SystemService.getSystems(page, Number(buildingId), Number(userId), null, assign_mode, street, city, order, column);
      }
      data["user"] = await UserService.getUserById(Number(userId));
      return await apiResponse(data);
    } catch (e) {
      console.error('Error: ', e);
      return internalServer({ message: e.message });
    }
  }
);

export const getSystemHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    let systemId = event.pathParameters && event.pathParameters.systemId;

    try {
      let system = await SystemService.getSystem(Number(systemId));
      return await apiResponse(mapSystemResponse(system));
    } catch (e) {
      console.error('Error: ', e);
      return internalServer({ message: e.message });
    }
  }
);

export const createSystemHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({ message: "You are not admin" });
    }
    const { error, request } = requestValidator(SchemaName.SYSTEM, event.body);
    if (error) {
      return badRequest({ message: error.message });
    }
    try {
      const iot = new AWS.Iot();

      // Create thing
      await iot.createThing({ thingName: request.name }).promise();

      // Attach thing to Certificate
      await iot.attachThingPrincipal({ principal: ARN_CERT, thingName: request.name }).promise();

      // Create Policy
      let policyDocument = {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "iot:Publish",
              "iot:Receive"
            ],
            "Resource": [
              "arn:aws:iot:us-west-2:233953772612:topic/sdk/test/java",
              "arn:aws:iot:us-west-2:233953772612:topic/sdk/test/Python",
              "arn:aws:iot:us-west-2:233953772612:topic/topic_1",
              "arn:aws:iot:us-west-2:233953772612:topic/topic_2",
              "arn:aws:iot:us-west-2:233953772612:topic/sensor/read/*",
              "arn:aws:iot:us-west-2:233953772612:topic/sensor/write/*"
            ]
          },
          {
            "Effect": "Allow",
            "Action": [
              "iot:Subscribe"
            ],
            "Resource": [
              "arn:aws:iot:us-west-2:233953772612:topicfilter/sdk/test/java",
              "arn:aws:iot:us-west-2:233953772612:topicfilter/sdk/test/Python",
              "arn:aws:iot:us-west-2:233953772612:topicfilter/topic_1",
              "arn:aws:iot:us-west-2:233953772612:topicfilter/topic_2",
              "arn:aws:iot:us-west-2:233953772612:topicfilter/sensor/read/*",
              "arn:aws:iot:us-west-2:233953772612:topicfilter/sensor/write/*"
            ]
          },
          {
            "Effect": "Allow",
            "Action": [
              "iot:Connect"
            ],
            "Resource": [
              "arn:aws:iot:us-west-2:233953772612:client/sdk-java",
              "arn:aws:iot:us-west-2:233953772612:client/basicPubSub",
              "arn:aws:iot:us-west-2:233953772612:client/sdk-nodejs-*",
              "arn:aws:iot:us-west-2:233953772612:client/" + request.name
            ]
          }
        ]
      };

      let params = {
        policyName: request.name + "-Policy",
        policyDocument: JSON.stringify(policyDocument)
      };
      await iot.createPolicy(params).promise();

      // Attach policy to certificate
      await iot.attachPolicy({ policyName: request.name + "-Policy", target: ARN_CERT }).promise();

      // Insert thing to MySQL DB
      const result = await SystemService.insertSystem({ ...request });
      return await apiResponse(mapSystemResponse(result));
    } catch (e) {
      return badRequest({ message: e.message });
    }
  }
);

export const updateSystemHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // @ts-ignore
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({ message: "You are not admin" });
    }
    const { systemId }: any = event.pathParameters;
    const { error, request } = requestValidator(SchemaName.SYSTEM, event.body);
    if (error) {
      return badRequest({ message: error.message });
    }
    try {
      let result = await SystemService.updateSystem(systemId, { ...request });
      return await apiResponse(mapSystemResponse(result));
    } catch (e) {
      return badRequest({ message: e.message });
    }
  }
);

export const assignUsersToSystemHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // @ts-ignore
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({ message: "You are not admin" });
    }
    const { systemId }: any = event.pathParameters;
    const { error, request } = requestValidator(SchemaName.SYSTEM_USER, event.body);
    if (error) {
      return badRequest({ message: error.message });
    }
    try {
      let result = await SystemService.assignUsers(systemId, request.users);
      return await apiResponse(mapSystemResponse(result));
    } catch (e) {
      return badRequest({ message: e.message });
    }
  }
);

export const deleteSystemHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // @ts-ignore
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({ message: "You are not admin" });
    }
    const { systemId }: any = event.pathParameters;
    try {
      const system = await SystemService.getSystem(systemId);

      const iot = new AWS.Iot();

      // Detach policy from certificate
      await iot.detachPolicy({ policyName: system.name + "-Policy", target: ARN_CERT }).promise();

      // Delete policy
      await iot.deletePolicy({ policyName: system.name + "-Policy" }).promise();

      // Detach principal from thing
      await iot.detachThingPrincipal({ principal: ARN_CERT, thingName: system.name }).promise();

      // Delete thing
      await iot.deleteThing({ thingName: system.name }).promise();

      const result = await SystemService.deleteSystem(systemId);
      return await apiResponse(result.affected != null);
    } catch (e) {
      return badRequest({ message: e.message });
    }
  }
);
