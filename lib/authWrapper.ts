import {APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context, Handler} from 'aws-lambda';
import {forbidden, unauthorized} from '@lib/response';
import {getAuthenticatedUser} from '@lib/auth-lib';
import {ICognitoUser} from "@interfaces/user";

/** Wraps all API Lambda handlers with common middleware */
export const authWrapper = (handler: Handler):
  (event: APIGatewayProxyEvent, context: Context, callback: Callback) => Promise<APIGatewayProxyResult> => async (
  event: APIGatewayProxyEvent, context: Context, callback: Callback,
): Promise<APIGatewayProxyResult> => {
  let user: ICognitoUser;
  try {
    user = await getAuthenticatedUser(event.headers);
  } catch (e) {
    console.error('Error: ', e);
    return unauthorized({message: e.message});
  }
  if (!user) {
    return forbidden({message: 'Not found audience matched'});
  }
  try {
    event.requestContext.authorizer = {
      claims: user,
    };
  } catch (e) {
    console.error('Error: ', e);
    return forbidden({message: "Error " + e.message});
  }
  return handler(event, context, callback);
};
