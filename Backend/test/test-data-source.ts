// test/test-data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './database/entities/User';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true,
  entities: [User],
  logging: false,
});
