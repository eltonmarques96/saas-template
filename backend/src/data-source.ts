import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './database/entities/User';

import { DataSourceOptions } from 'typeorm';
import { Token } from './database/entities/Token';

let configurations: DataSourceOptions;

if (process.env.NODE_ENV === 'test') {
  configurations = {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User, Token],
    migrations: [
      './src/database/migrations/1744406196160-user.ts',
      './src/database/migrations/1745281251943-token.ts',
    ],
    subscribers: [],
  };
} else if (process.env.NODE_ENV === 'production') {
  configurations = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_HOST,
    synchronize: false,
    logging: false,
    entities: [User, Token],
    migrations: [
      './src/database/migrations/1744406196160-user.ts',
      './src/database/migrations/1745281251943-token.ts',
    ],
    subscribers: [],
  };
} else {
  configurations = {
    type: 'sqlite',
    database: 'src/database/db.sqlite',
    synchronize: false,
    dropSchema: false,
    logging: false,
    entities: [User, Token],
    migrations: [
      './src/database/migrations/1744406196160-user.ts',
      './src/database/migrations/1745281251943-token.ts',
    ],
    subscribers: [],
  };
}
const AppDataSource = new DataSource(configurations);

export default AppDataSource;

/*

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})

*/
