import { APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context } from "aws-lambda";
import { apiResponse, badRequest, forbidden } from "@lib/response";
import { ICognitoUser } from "@interfaces/user";
import { requestValidator, SchemaName } from "@lib/validator/validator";
import { authWrapper } from "@lib/authWrapper";

const AWS = require("aws-sdk");
const PROCESS_TABLE_NAME = "LOCUS_process";
const COMMAND_TABLE_NAME = "LOCUS_command";
const CONTROL_TABLE_NAME = "LOCUS_control";

AWS.config.update({
  region: process.env.AWS_REGION,
  dynamodb: '2012-08-10',
});
const docClient = new AWS.DynamoDB.DocumentClient();

export const getCommandsHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    let start_time = event.queryStringParameters && event.queryStringParameters.start;
    let end_time = event.queryStringParameters && event.queryStringParameters.end;
    let system_name = event.queryStringParameters && event.queryStringParameters.system_name;

    if (start_time == null || end_time == null || system_name == null) {
      return badRequest({ message: "Invalid parameters" });
    }
    try {
      const kce = '#system_name=:system_name AND #timestamp BETWEEN :start_time AND :end_time';
      const ean = {
        '#system_name': 'system_name',
        '#timestamp': 'timestamp',
      }
      const eav = {
        ':system_name': system_name,
        ':start_time': Number(start_time),
        ':end_time': Number(end_time),
      }
      const params = {
        TableName: COMMAND_TABLE_NAME,
        KeyConditionExpression: kce,
        ExpressionAttributeNames: ean,
        ExpressionAttributeValues: eav
      };
      const data = await docClient.query(params).promise();
      return apiResponse(data["Items"]);
    } catch (e) {
      return badRequest({ message: e.message });
    }
  }
);

export const createCommandHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({ message: "You are not allowed" });
    }
    const { error, request } = requestValidator(SchemaName.COMMAND, event.body);
    if (error) {
      return badRequest({ message: error.message });
    }
    try {
      let requestData = {
        'timestamp': Date.now(),
        'user': {
          'id': user.sub,
          'family_name': user.family_name,
          'given_name': user.given_name,
        },
        ...request,
      };
      let params = {
        TableName: COMMAND_TABLE_NAME,
        Item: requestData
      };
      await docClient.put(params).promise();

      // Publish message to Device
      const pubMessage = {
        ...request,
        message: 'command'
      };
      const params2 = {
        topic: 'sensor/read/aws',
        payload: JSON.stringify(pubMessage),
        qos: 0
      };

      const iotdata = new AWS.IotData({ endpoint: process.env.IoTEndpoint });
      const data = await iotdata.publish(params2).promise();
      return apiResponse(data);
    } catch (e) {
      return badRequest({ message: e.message });
    }
  }
);
