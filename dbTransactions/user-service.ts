import {db} from '@/db/db';
import {Connection, DeleteResult, Repository} from 'typeorm';
import {User} from "@db/entities/User";
import {mapUserResponse} from "@lib/response-map/user";
import {PAGE_LIMIT} from "@/constants";
import {isStringNonNull} from "@lib/utility";

class UserServiceClass {
  public userRepo: Repository<User>;
  private conn: Connection;

  public getUsers = async (page: string, given_name: string, family_name: string, order: string, column: string) => {
    await this.connect();
    const current = page ? Number(page) : 1
    const skip = (current - 1) * PAGE_LIMIT;

    let queryBuilder = await this.userRepo
      .createQueryBuilder('user')

    if (isStringNonNull(given_name)) {
      queryBuilder
        .where(`given_name LIKE '%${given_name}%'`);
    }

    if (isStringNonNull(family_name)) {
      queryBuilder
        .andWhere(`family_name LIKE '%${family_name}%'`);
    }

    if (isStringNonNull(column) && isStringNonNull(order)) {
      const orderCon = order == 'ASC' ? 'ASC' : 'DESC';
      queryBuilder
        .orderBy(`${column}`, orderCon);
    }

    queryBuilder
      .take(PAGE_LIMIT)
      .skip(skip);

    let users: User[];
    let total: number;
    [users, total] = await queryBuilder.getManyAndCount();

    return {
      data: users.map(mapUserResponse),
      total: total,
      current: current,
      pageSize: PAGE_LIMIT
    }
  };

  public insertUser = async (insertData: Partial<User>): Promise<User> => {
    await this.connect();
    const insertResult = await this.userRepo.insert(insertData);
    return this.userRepo.findOne(insertResult.identifiers[0].id);
  };

  public getUserById = async (id: number): Promise<User> => {
    if (id) {
      await this.connect();
      return this.userRepo.findOne({where: {id}});
    } else {
      return null;
    }
  };

  public getUserByUsername = async (username: string): Promise<User> => {
    await this.connect();
    return this.userRepo.findOne({
      where: {
        username,
      },
    });
  };

  public updateUser = async (id: number, updateData: Partial<User>): Promise<User> => {
    await this.connect();
    const updateResult = await this.userRepo.update({id}, updateData);
    return this.userRepo.findOne(id);
  };

  public deleteUser = async (id: number): Promise<DeleteResult> => {
    await this.connect();
    return this.userRepo.delete({id});
  };

  private connect = async (): Promise<void> => {
    this.conn = await db.connect();
    if (!this.userRepo) {
      this.userRepo = this.conn.getRepository(User);
    }
  };
}

export const UserService = new UserServiceClass();
