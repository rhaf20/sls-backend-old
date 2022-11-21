import {IBuilding} from "@interfaces/building";
import {Building} from "@db/entities/Building";
import {mapSystemResponse} from "@lib/response-map/system";

export const mapBuildingResponse = (building: Building): IBuilding => ({
  id: building.id,
  systems: building.systems && building.systems.map(mapSystemResponse),
  name: building.name,
  street: building.street,
  city: building.city,
  state: building.state,
  zipcode: building.zipcode,
  type: building.type,
  owner_first_name: building.owner_first_name,
  owner_last_name: building.owner_last_name,
  owner_company: building.owner_company,
  owner_phone: building.owner_phone,
  owner_email: building.owner_email,
  utility: building.utility,
  climate_zone: building.climate_zone,
  group_weather: building.group_weather,
  group_energy_supply: building.group_energy_supply,
  group_dispatch: building.group_dispatch,
  onsite_solar_pv: building.onsite_solar_pv,
  number_story: building.number_story,
  number_housing_unit: building.number_housing_unit,
  notes: building.notes,
  active: building.active,
  created_at: building.created_at,
  updated_at: building.updated_at,
});