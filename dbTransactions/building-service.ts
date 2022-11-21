import {db} from '@/db/db';
import {Connection, DeleteResult, Repository} from 'typeorm';
import {Building} from "@db/entities/Building";
import {PAGE_LIMIT} from "@/constants";
import {mapBuildingResponse} from "@lib/response-map/building";
import {isStringNonNull} from "@lib/utility";

class BuildingServiceClass {
  public buildingRepo: Repository<Building>;
  private conn: Connection;

  public getBuildings = async (page: string, street: string, city: string, order: string, column: string) => {
    await this.connect();

    const current = page ? Number(page) : 1
    const skip = (current - 1) * PAGE_LIMIT;

    let queryBuilder = await this.buildingRepo
      .createQueryBuilder('building')

    if (isStringNonNull(street)) {
      queryBuilder
        .where(`street LIKE '%${street}%'`);
    }

    if (isStringNonNull(city)) {
      queryBuilder
        .andWhere(`city LIKE '%${city}%'`);
    }

    if (isStringNonNull(column) && isStringNonNull(order)) {
      const orderCon = order == 'ASC' ? 'ASC' : 'DESC';
      queryBuilder
        .orderBy(`${column}`, orderCon);
    }

    queryBuilder
      .take(PAGE_LIMIT)
      .skip(skip);

    let buildings: Building[];
    let total: number;
    [buildings, total] = await queryBuilder.getManyAndCount();

    return {
      data: buildings.map(mapBuildingResponse),
      total: total,
      current: current,
      pageSize: PAGE_LIMIT
    }
  };

  public getBuilding = async (id: number): Promise<Building> => {
    await this.connect();
    return this.buildingRepo.findOne(id);
  };

  public insertBuilding = async (insertData: Partial<Building>): Promise<Building> => {
    await this.connect();
    const insertResult = await this.buildingRepo.insert(insertData);
    return this.buildingRepo.findOne(insertResult.identifiers[0].id);
  };

  public updateBuilding = async (id: number, updateData: Partial<Building>): Promise<Building> => {
    await this.connect();
    await this.buildingRepo.update({id}, updateData);
    return this.buildingRepo.findOne(id);
  };

  public deleteBuilding = async (id: number): Promise<DeleteResult> => {
    await this.connect();
    return this.buildingRepo.delete({id});
  };

  private connect = async (): Promise<void> => {
    this.conn = await db.connect();
    if (!this.buildingRepo) {
      this.buildingRepo = this.conn.getRepository(Building);
    }
  };
}

export const BuildingService = new BuildingServiceClass();
