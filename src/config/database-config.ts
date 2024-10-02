import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Entities } from '../entities/entities';
ConfigModule.forRoot();
const { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_TYPE } =
  process.env;
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

// console.log({
//   NODE_ENV, host, port, username, password, database, url, type,
// })

export const databaseConfig: DataSourceOptions =
  type === "local" ? {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    url,
    entities: Entities,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
    synchronize: true,
  } : {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    url,
    entities: Entities,
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: true,
  };