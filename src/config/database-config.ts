import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { entities } from '../list/entities/entities';

ConfigModule.forRoot();

const {
  NODE_ENV = 'development',
  DB_HOST,
  DB_PORT = '5432',
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_TYPE = 'local',
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error('Missing required database environment variables');
}

const host = DB_HOST;
const port = Number(DB_PORT);
const username = DB_USER;
const password = DB_PASSWORD;
const database = DB_NAME;
const type = DB_TYPE;

const url =
  NODE_ENV === 'production'
    ? `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    : undefined;

export const databaseConfig: DataSourceOptions =
  type === 'local'
    ? {
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        url,
        entities,
        synchronize: true,
        logging: true,
      }
    : {
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        url,
        entities,
        ssl: {
          rejectUnauthorized: false, // Replace with a valid CA certificate in production
        },
        synchronize: true,
        logging: true,
      };
