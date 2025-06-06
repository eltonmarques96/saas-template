// test/jest-setup.ts

import { SetupServer } from './server'; // ou o caminho correto
import supertest from 'supertest';

beforeAll(async () => {
  const server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});
