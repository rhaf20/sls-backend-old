import { APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context } from "aws-lambda";
import { apiResponse, badRequest, forbidden } from "@lib/response";
import { ICognitoUser } from "@interfaces/user";
import { authWrapper } from "@lib/authWrapper";

const AWS = require("aws-sdk");
const CONTROL_TABLE_NAME = "LOCUS_process";

AWS.config.update({
  region: process.env.AWS_REGION,
  dynamodb: '2012-08-10',
});
const docClient = new AWS.DynamoDB.DocumentClient();

export const getProcessDataHandler: APIGatewayProxyHandler = authWrapper(
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
        TableName: CONTROL_TABLE_NAME,
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