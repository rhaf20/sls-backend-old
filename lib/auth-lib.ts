import * as jwt from 'jsonwebtoken';
import JwksRsa, {JwksClient, SigningKey} from 'jwks-rsa';
import {ICognitoUser} from "@interfaces/user";
import {UserService} from "@/dbTransactions/user-service";
import {User} from "@db/entities/User";

export const getAuthenticatedUser = async (headers: any): Promise<ICognitoUser> => {
  if (!headers || !headers.Authorization) {
    throw new Error(`Authorization header does not exist`);
  }
  const token = headers.Authorization.replace('Bearer ', '');
  let decodedToken;
  try {
    decodedToken = jwt.decode(token, {complete: true});
  } catch (err) {
    console.error('Error: ', err);
    throw err;
  }
  if (!decodedToken || !decodedToken.payload) {
    throw new Error(`Invalid Authorization token`);
  }
  let authenticatedUser: ICognitoUser;
  const {iss} = decodedToken.payload;
  if (process.env.ISSUER.localeCompare(iss)) {
    throw new Error(`Invalid issuer with ${iss}`);
  }
  const jwksClient: JwksClient = JwksRsa({jwksUri: `${iss}/.well-known/jwks.json`});
  authenticatedUser = await validateRS256(token, decodedToken, jwksClient, process.env.USER_POOL_CLIENT_ID);
  authenticatedUser.role = authenticatedUser['custom:role'];
  return authenticatedUser;
};

const validateRS256 = async (token: string, decodedToken: any, client: JwksClient, audience: string): Promise<ICognitoUser> => {
  const {kid, alg} = decodedToken.header;
  return new Promise((resolve, reject) => {
    try {
      client.getSigningKey(kid, (keyError: Error | null, key: SigningKey) => {
        if (keyError) {
          console.error('Error: ', keyError);
          return reject(keyError);
        }
        jwt.verify(token, key.getPublicKey(),
          {
            algorithms: [alg],
            audience,
            ignoreExpiration: false,
          }, (verificationError: any, decoded: unknown) => {
            if (verificationError) {
              return reject(verificationError);
            }
            resolve(decoded as ICognitoUser);
          },
        );
      });
    } catch (error) {
      console.error('Error: ', error);
      reject(error);
    }
  });
};

export const getUserFromDB = async (cognitoUuid: string): Promise<User> => {
  const userFromDb = await UserService.getUserByUsername(cognitoUuid);
  if (!userFromDb) {
    throw new Error('User doesn\'t exist in the db');
  }
  if (!userFromDb.active) {
    throw new Error('User is inactive.');
  }
  return userFromDb;
};