import {APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context} from "aws-lambda";
import {apiResponse, badRequest, forbidden} from "@lib/response";
import {UserRoles} from "@/constants";
import {ICognitoUser} from "@interfaces/user";
import {requestValidator, SchemaName} from "@lib/validator/validator";
import {mapUserResponse} from "@lib/response-map/user";
import {UserService} from "@/dbTransactions/user-service";
import {authWrapper} from "@lib/authWrapper";
import AWS = require('aws-sdk');

const cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
});
const USER_POOL_ID = process.env.USER_POOL_ID as string;

export const getAllUsersHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({message: "You are not admin"});
    }

    let page = event.queryStringParameters && event.queryStringParameters.page;
    let given_name = event.queryStringParameters && event.queryStringParameters.given_name;
    let family_name = event.queryStringParameters && event.queryStringParameters.family_name;
    let order = event.queryStringParameters && event.queryStringParameters.order;
    let column = event.queryStringParameters && event.queryStringParameters.column;

    try {
      let result = await UserService.getUsers(page, given_name, family_name, order, column);
      return await apiResponse(result);
    } catch (err) {
      return badRequest({message: err.message});
    }
  }
);

export const createUserHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({message: "You are not admin"});
    }
    const {error, request} = requestValidator(SchemaName.USER, event.body);
    if (error) {
      return badRequest({message: error.message});
    }
    let params: AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserRequest = {
      UserPoolId: USER_POOL_ID,
      Username: request.email,
      TemporaryPassword: request.password,
      DesiredDeliveryMediums: [
        "EMAIL"
      ],
      UserAttributes: [
        {
          Name: 'email',
          Value: request.email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        },
        {
          Name: 'family_name',
          Value: request.family_name
        },
        {
          Name: 'given_name',
          Value: request.given_name
        },
        {
          Name: 'phone_number',
          Value: request.phone_number
        },
        {
          Name: 'custom:company',
          Value: request.company ? request.company : ""
        },
        {
          Name: 'custom:notes',
          Value: request.notes ? request.notes : ""
        },
        {
          Name: 'custom:role',
          Value: request.role
        },
      ],
    };

    try {
      const data = await cognitoIdServiceProvider.adminCreateUser(params).promise();
      // Add user to RDS
      request["username"] = data.User['Username']
      const newUser = await UserService.insertUser({...request});
      return await apiResponse(mapUserResponse(newUser));
    } catch (err) {
      return badRequest({message: err.message});
    }
  }
);

export const updateUserHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    const {username} = event.pathParameters;
    if (user.role != UserRoles.ADMIN && user.sub != username) {
      return forbidden({message: "You are not allowed"});
    }
    const {error, request} = requestValidator(SchemaName.USER, event.body);
    if (error) {
      return badRequest({message: error.message});
    }

    let userAttributes = [
      {
        Name: 'email',
        Value: request.email
      },
      {
        Name: 'email_verified',
        Value: 'true'
      },
      {
        Name: 'family_name',
        Value: request.family_name
      },
      {
        Name: 'given_name',
        Value: request.given_name
      },
      {
        Name: 'phone_number',
        Value: request.phone_number
      },
      {
        Name: 'custom:company',
        Value: request.company ? request.company : ""
      },
      {
        Name: 'custom:notes',
        Value: request.notes ? request.notes : ""
      },
    ];
    if (request.role) {
      userAttributes.push(
        {
          Name: 'custom:role',
          Value: request.role
        }
      );
    }
    let params: AWS.CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesRequest = {
      UserPoolId: USER_POOL_ID,
      Username: username,
      UserAttributes: userAttributes
    }

    try {
      let user = await UserService.getUserByUsername(username);
      if (user == null) {
        return badRequest({message: "invalid user"});
      }
      await cognitoIdServiceProvider.adminUpdateUserAttributes(params).promise();
      const updateUser = await UserService.updateUser(user.id, {...request});
      return await apiResponse(mapUserResponse(updateUser));
    } catch (err) {
      return badRequest({message: err.message});
    }
  }
);

export const changeUserStatusHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({message: "You are not admin"});
    }
    const {username} = event.pathParameters;
    const {status} = event.queryStringParameters;
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: username,
    };
    try {
      let user = await UserService.getUserByUsername(username);
      if (user == null) {
        return badRequest({message: "invalid user"});
      }
      let request = {};
      if (status == "1") {
        await cognitoIdServiceProvider.adminEnableUser(params).promise();
        request["active"] = true;
      } else {
        await cognitoIdServiceProvider.adminDisableUser(params).promise();
        request["active"] = false;
      }
      const updateUser = await UserService.updateUser(user.id, {...request});
      return await apiResponse(mapUserResponse(updateUser));
    } catch (err) {
      return badRequest({message: err.message});
    }
  }
);

export const deleteUserHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({message: "You are not admin"});
    }
    const {username} = event.pathParameters;
    const params = {
      UserPoolId: USER_POOL_ID,
      Username: username,
    };
    try {
      let user = await UserService.getUserByUsername(username);
      if (user == null) {
        return badRequest({message: "invalid user"});
      }
      await cognitoIdServiceProvider.adminDeleteUser(params).promise();
      const result = await UserService.deleteUser(user.id);
      return await apiResponse(result.affected != null);
    } catch (err) {
      return badRequest({message: err.message});
    }
  }
);