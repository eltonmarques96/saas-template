import { City } from '@/cities/entities/city.entity';
import { Exam } from '@/exams/entities/exam.entity';
import { Organization } from '@/organizations/entities/organization.entity';
import { State } from '@/states/entities/state.entity';
import { User } from '@/users/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const isTest = process.env.NODE_ENV === 'test';
  const sqliteConfiguration: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: ':memory:',
    synchronize: isTest,
    dropSchema: isTest,
    entities: [__dirname + '/../../**/*.entity.ts'],
  };
  const postgresConfiguration: TypeOrmModuleOptions = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: false,
    dropSchema: false,
    autoLoadEntities: true,
    entities: [User, Exam, Organization, City, State],
    migrations: [__dirname + '/migrations/*.ts'],
  };
  if (isTest) {
    return sqliteConfiguration;
  }
  return postgresConfiguration;
}

import { DataSourceOptions } from 'typeorm';

const AppDataSource = new DataSource(getTypeOrmConfig() as DataSourceOptions);
export default AppDataSource;
