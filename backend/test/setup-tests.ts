import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { populateCitiesTables } from './seeds/populate-cities';
import { populateUsersTable } from './seeds/populate-user';
// caso você tenha seeds separados para estados

let dataSource: DataSource;

export const setupTestDatabase = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  dataSource = moduleRef.get<DataSource>(DataSource);

  return { moduleRef, dataSource };
};

/**
 * Função para rodar todos os seeds necessários antes de cada teste
 */
export const runSeeds = async (ds: DataSource) => {
  if (!ds.isInitialized) {
    await ds.initialize();
  }

  // Aqui você pode limpar tabelas se quiser
  await ds.synchronize(true);

  await populateCitiesTables(ds);
  await populateUsersTable(ds);
};

// Para ter acesso ao datasource em testes
export const testDataSource = () => dataSource;
