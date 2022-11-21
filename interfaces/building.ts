import {ISystem} from "@interfaces/system";
import {BuildingType, BuildingUtility} from "@/constants";

export interface IBuilding {
  id?: number,
  systems: ISystem[]
  name: string,
  street: string,
  city: string,
  state: string,
  zipcode: string,
  type: BuildingType,
  owner_first_name?: string,
  owner_last_name?: string,
  owner_company?: string,
  owner_phone?: string,
  owner_email?: string,
  utility: BuildingUtility,
  climate_zone: number,
  group_weather?: number,
  group_energy_supply?: number,
  group_dispatch?: number,
  onsite_solar_pv: boolean,
  number_story: number,
  number_housing_unit: number,
  notes?: string,
  active: boolean,
  created_at: Date,
  updated_at: Date,
}