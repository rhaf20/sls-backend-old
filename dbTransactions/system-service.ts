import {db} from '@/db/db';
import {Connection, DeleteResult, Repository} from 'typeorm';
import {System} from "@db/entities/System";
import {PAGE_LIMIT} from "@/constants";
import {isStringNonNull} from "@lib/utility";
import {mapSystemResponse} from "@lib/response-map/system";
import {User} from "@db/entities/User";

class SystemServiceClass {
  public systemRepo: Repository<System>;
  private conn: Connection;

  public getSystems = async (page: string, buildingId: number, userId: number, 
    username: string, assign: boolean, street: string, 
    city: string, order: string, column: string) => {
    await this.connect();

    const current = page ? Number(page) : 1
    const skip = (current - 1) * PAGE_LIMIT;

    let queryBuilder = await this.systemRepo
      .createQueryBuilder('system')
      .leftJoinAndSelect('system.building', 'building')
      .leftJoinAndSelect('system.users', 'user');

    if (buildingId && buildingId > 0) {
      queryBuilder
        .where('building.id = :buildingId', {buildingId: buildingId});
    }

    if (userId && userId > 0) {
      if (assign) {
        queryBuilder
          .andWhere('user.id != :userId OR user.id IS NULL', {userId: userId});
      } else {
        queryBuilder
          .andWhere('user.id = :userId', {userId: userId});
      }
    }

    if (isStringNonNull(username)) {
      queryBuilder
        .andWhere('user.username = :username', {username: username});
    }

    if (isStringNonNull(street)) {
      queryBuilder
        .andWhere(`building.street LIKE '%${street}%'`);
    }

    if (isStringNonNull(city)) {
      queryBuilder
        .andWhere(`city LIKE %${city}%`);
    }

    if (isStringNonNull(column) && isStringNonNull(order)) {
      const orderCon = order == 'ASC' ? 'ASC' : 'DESC';
      queryBuilder
        .orderBy(`${column}`, orderCon);
    }

    queryBuilder
      .take(PAGE_LIMIT)
      .skip(skip);

    let systems: System[];
    let total: number;
    [systems, total] = await queryBuilder.getManyAndCount();

    return {
      data: systems.map(mapSystemResponse),
      total: total,
      current: current,
      pageSize: PAGE_LIMIT
    }
  };

  public getSystem = async (id: number): Promise<System> => {
    await this.connect();
    return this.systemRepo.findOne(id);
  };

  public insertSystem = async (insertData: Partial<System>): Promise<System> => {
    await this.connect();
    const insertResult = await this.systemRepo.insert(insertData);
    return this.systemRepo.findOne(insertResult.identifiers[0].id);
  };

  public updateSystem = async (id: number, updateData: Partial<System>): Promise<System> => {
    await this.connect();
    await this.systemRepo.update({id}, updateData);
    return this.systemRepo.findOne(id);
  };

  public assignUsers = async (id: number, users: Partial<User[]>): Promise<System> => {
    await this.connect();
    const system = await this.systemRepo.findOne({id});
    system.users = users
    await this.systemRepo.save(system);
    return this.systemRepo.findOne(id);
  };

  public deleteSystem = async (id: number): Promise<DeleteResult> => {
    await this.connect();
    return this.systemRepo.delete({id});
  };

  private connect = async (): Promise<void> => {
    this.conn = await db.connect();
    if (!this.systemRepo) {
      this.systemRepo = this.conn.getRepository(System);
    }
  };
}

export const SystemService = new SystemServiceClass();
