import { City } from '../../src/cities/entities/city.entity';
import { State } from '../../src/states/entities/state.entity';
import { DataSource } from 'typeorm';

// seeds/populate-cities.ts
export const populateCitiesTables = async (dataSource: DataSource) => {
  const estadoRepo = dataSource.getRepository(State);
  const cityRepo = dataSource.getRepository(City);

  const estadosCount = await estadoRepo.count();
  if (estadosCount === 0) {
    const estados = [
      estadoRepo.create({ id: 1, nome: 'Bahia', sigla: 'BA' }),
      estadoRepo.create({ id: 2, nome: 'São Paulo', sigla: 'SP' }),
    ];
    await estadoRepo.save(estados);

    const cidades = [
      cityRepo.create({ id: 1, nome: 'Salvador', state: estados[0] }),
      cityRepo.create({ id: 2, nome: 'São Paulo', state: estados[1] }),
    ];
    await cityRepo.save(cidades);
  }
};
