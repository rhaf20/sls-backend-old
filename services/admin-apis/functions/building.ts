import {APIGatewayProxyEvent, APIGatewayProxyHandler, Callback, Context} from "aws-lambda";
import {apiResponse, badRequest, forbidden, internalServer} from "@lib/response";
import {UserRoles} from "@/constants";
import {ICognitoUser} from "@interfaces/user";
import {BuildingService} from "@/dbTransactions/building-service";
import {mapBuildingResponse} from "@lib/response-map/building";
import {requestValidator, SchemaName} from "@lib/validator/validator";
import {authWrapper} from "@lib/authWrapper";

export const getBuildingsHandler: APIGatewayProxyHandler = authWrapper(
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
    let street = event.queryStringParameters && event.queryStringParameters.street;
    let city = event.queryStringParameters && event.queryStringParameters.city;
    let order = event.queryStringParameters && event.queryStringParameters.order;
    let column = event.queryStringParameters && event.queryStringParameters.column;
    try {
      let data = await BuildingService.getBuildings(page, street, city, order, column);
      return await apiResponse(data);
    } catch (e) {
      console.error('Error: ', e);
      return internalServer({message: e.message});
    }
  }
);

export const createBuildingHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // Check user role
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({message: "You are not admin"});
    }
    const {error, request} = requestValidator(SchemaName.BUILDING, event.body);
    if (error) {
      return badRequest({message: error.message});
    }
    try {
      const newBuilding = await BuildingService.insertBuilding({...request});
      return await apiResponse(mapBuildingResponse(newBuilding));
    } catch (e) {
      return badRequest({message: e.message});
    }
  }
);

export const updateBuildingHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // @ts-ignore
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({message: "You are not admin"});
    }
    const {buildingId}: any = event.pathParameters;
    const {error, request} = requestValidator(SchemaName.BUILDING, event.body);
    if (error) {
      return badRequest({message: error.message});
    }
    try {
      const updateBuilding = await BuildingService.updateBuilding(buildingId, {...request});
      return await apiResponse(mapBuildingResponse(updateBuilding));
    } catch (e) {
      return badRequest({message: e.message});
    }
  }
);

export const deleteBuildingHandler: APIGatewayProxyHandler = authWrapper(
  async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    // @ts-ignore
    let user = event.requestContext.authorizer.claims as ICognitoUser;
    if (user == null) {
      return forbidden({message: "You are not allowed"});
    }
    if (user.role != UserRoles.ADMIN) {
      return forbidden({message: "You are not admin"});
    }
    const {buildingId}: any = event.pathParameters;
    try {
      const result = await BuildingService.deleteBuilding(buildingId);
      return await apiResponse(result.affected != null);
    } catch (e) {
      return badRequest({message: e.message});
    }
  }
);
