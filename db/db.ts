import 'reflect-metadata';
import {Connection, ConnectionManager, getConnectionManager} from 'typeorm';
import CONFIG from '../config';
import {Building} from "@db/entities/Building";
import {System} from "@db/entities/System";
import {User} from "@db/entities/User";

class Database {
  public connection: Connection;
  private connections: ConnectionManager;

  constructor() {
    this.connections = getConnectionManager();
  }

  public connect = async (): Promise<Connection> => {
    if (this.connection) {
      if (!this.connection.isConnected) {
        await this.connection.connect();
      }
      return this.connection;
    }
    const connection = this.connections.create({
      type: 'mysql',
      ...CONFIG.isLocal ? CONFIG.db.local : CONFIG.db[CONFIG.stage],
      entities: [
        Building,
        System,
        User,
      ],
    });
    await connection.connect();
    this.connection = connection;
    return connection;
  };

  public disconnectAll = async (): Promise<boolean> => {
    if (this.connection) {
      await this.connection.close();
      return true;
    }
    return false;
  };
}

export const db = new Database();
