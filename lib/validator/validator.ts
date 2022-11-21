import {ObjectSchema} from '@hapi/joi';
import {
  buildingValidatorSchema,
  systemValidatorSchema,
  systemUsersValidatorSchema,
  userValidatorSchema,
  commandValidatorSchema,
  controlValidatorSchema,
} from '@lib/validator/requestSchemas';

export enum SchemaName {
  USER = 'USER',
  BUILDING = 'BUILDING',
  SYSTEM = 'SYSTEM',
  SYSTEM_USER = 'SYSTEM_USER',
  COMMAND = 'COMMAND',
  CONTROL = 'CONTROL',
}


const schemas: { [schemaName: string]: ObjectSchema<any> } = {
  USER: userValidatorSchema,
  BUILDING: buildingValidatorSchema,
  SYSTEM: systemValidatorSchema,
  SYSTEM_USER: systemUsersValidatorSchema,
  COMMAND: commandValidatorSchema,
  CONTROL: controlValidatorSchema,
};

export const requestValidator = (schemaName: SchemaName, requestBody: any, requiredKeys?: string[]): {
  error: Error;
  request: { [key: string]: any; };
} => {
  let objToValidate = {};
  try {
    if (!requestBody) {
      throw new Error('Missing body');
    }
    if (typeof requestBody === 'string') {
      requestBody = JSON.parse(requestBody);
    }
    if (!requiredKeys || !requiredKeys.length) {
      objToValidate = requestBody;
    } else {
      requiredKeys.map(key => {
        if (requestBody.hasOwnProperty(key)) {
          objToValidate[key] = requestBody[key];
        } else {
          throw new Error(`Invalid key ${key}`);
        }
      });
    }
    const result = schemas[schemaName].validate(objToValidate, {allowUnknown: true});
    if (result.error && result.error.details && result.error.details.length) {
      throw new Error(result.error.details.map(detail => detail.message).toString());
    }
    return {error: null, request: result.value};
  } catch (e) {
    console.error('Error: ', e);
    return {error: e, request: null};
  }
};
