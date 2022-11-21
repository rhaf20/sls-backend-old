import Joi from '@hapi/joi';

export const userValidatorSchema = Joi.object({
  email: Joi.string(),
  username: Joi.string().min(3).max(255),
  password: Joi.string(),
  family_name: Joi.string(),
  given_name: Joi.string(),
  phone_number: Joi.string(),
  role: Joi.string(),
});

export const buildingValidatorSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  street: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  zipcode: Joi.string(),
  type: Joi.number(),
  utility: Joi.number(),
  climate_zone: Joi.number(),
  onsite_solar_pv: Joi.boolean(),
  number_story: Joi.number(),
  number_housing_unit: Joi.number(),
  active: Joi.boolean(),
});

export const systemValidatorSchema = Joi.object({
  building: Joi.number(),
  name: Joi.string().min(3).max(128).pattern(new RegExp('^[a-zA-Z0-9:_-]+$')).required(),
  type: Joi.number(),
  hpwh_primary_manufacturer: Joi.number(),
  hpwh_primary_number: Joi.number(),
  hpwh_primary_model: Joi.string(),
  hpwh_primary_btuhr: Joi.number(),
  hpwh_recirc_manufacturer: Joi.number(),
  hpwh_recirc_number: Joi.number(),
  hybrid_hpwh_gas: Joi.boolean(),
  location: Joi.string(),
  active: Joi.boolean(),
});

export const systemUsersValidatorSchema = Joi.object({
  users: Joi.array(),
});

export const commandValidatorSchema = Joi.object({
  system_name: Joi.string(),
  type: Joi.number(),
  param1: Joi.number(),
  param2: Joi.number(),
  param3: Joi.number(),
  param4: Joi.number(),
});

export const controlValidatorSchema = Joi.object({
  system_name: Joi.string(),
  hot_water_demand: Joi.array(),
  electricity_price: Joi.array(),
  carbon_intensity: Joi.array(),
  resource_availability: Joi.array(),
  ambient_temperature: Joi.array(),
});