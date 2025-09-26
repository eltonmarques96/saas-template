import { City } from '@/cities/entities/city.entity';
import { State } from '@/states/entities/state.entity';
import { User } from '@/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { ulid } from 'ulid';

export const populateUsersTable = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);
  const cityRepo = dataSource.getRepository(City);
  const estadoRepo = dataSource.getRepository(State);

  const userCount = await userRepo.count();
  if (userCount > 0) return;

  await estadoRepo.save(
    estadoRepo.create({ id: 980, nome: 'Ceará', sigla: 'CE' }),
  );

  await cityRepo.save({
    id: 983,
    nome: 'Fortaleza',
    state_id: 980,
  });

  await userRepo.save({
    id: ulid(),
    firstName: 'Carlos Eduardo',
    lastName: 'Cadu',
    email: 'carlos.edu@example.com',
    phone: '71911112222',
    password: 'senhaCarlos321',
    activated: true,
    cidade_id: 983,
  });
  await userRepo.save({
    id: ulid(),
    firstName: 'Joao Marcelo',
    lastName: 'dos Santos',
    email: 'joao.marcelo@example.com',
    phone: '7199833211',
    password: 'senhaCarlos321',
    activated: true,
    cidade_id: 383,
  });
  await userRepo.save({
    id: ulid(),
    firstName: 'Ana',
    lastName: 'dos Santos',
    email: 'ana.dos santos@example.com',
    phone: '7199832232',
    password: 'senhaCarlos321',
    activated: true,
    cidade_id: 333,
  });
};
