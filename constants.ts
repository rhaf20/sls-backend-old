export const PAGE_LIMIT = 20;

export enum UserRoles {
  ADMIN = 'ADMIN',
  TECH = 'TECH',
  USER = 'USER',
}

export enum BuildingType {
  SINGLE_FAMILY = 0,
  MULTI_FAMILY = 1,
  LODGING = 2,
  OTHER = 3
}

export enum BuildingUtility {
  PGE = 0,
  SCE = 1,
  SMUD = 2,
  LADWP = 3,
  PALOALTO = 4,
  SDGE = 5,
  OTHER = 6
}

export enum SystemType {
  INDIVIDUAL = 0,
  CENTRAL = 1,
  DISTRIBUTED = 2,
  OTHER = 3
}

export enum SystemManufacturer {
  SANDEN = 0,
  COLMAC = 1,
  NILE = 2,
  AOSMITH = 3,
  RHEEM = 4,
  OTHER = 5
}