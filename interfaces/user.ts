import {UserRoles} from "@/constants";

export interface ICognitoUser {
  sub: string; // Identified user id, example: '63713492-b882-484c-9b26-3e88c88e276b',
  aud: string; // App client id distinguished by frontend
  email_verified: boolean;
  event_id: string; // Identified by every request, example: 'bf728445-b6ea-4cf6-8ff0-a3deb7096935',
  token_use: string; // example: 'id'
  auth_time: number; // timestamp
  iss: string; // https://cognito-idp.${CONFIG.region}.amazonaws.com/${CONFIG.cognito.COGNITO_USER_POOL_ID}
  exp: number; // expiry timestamp
  iat: number; // Issued at timestamp
  email: string;
  family_name: string,
  given_name: string,
  'custom:role': string; // Customized here
  role: string; // Customized here
}

export interface IDatabaseUser {
  id?: number,
  email: string,
  username: string,
  family_name: string,
  given_name: string,
  phone_number: string,
  company: string,
  notes: string,
  role: UserRoles,
  active: boolean,
  created_at: Date,
  updated_at: Date,
}