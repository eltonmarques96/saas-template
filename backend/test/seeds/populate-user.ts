import { Cidade } from '@/cities/entities/city.entity';
import { Estado } from '@/states/entities/state.entity';
import { RacaType, SexoType, Usuario } from '@/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { ulid } from 'ulid';

export const populateUsersTable = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(Usuario);
  const cityRepo = dataSource.getRepository(Cidade);
  const estadoRepo = dataSource.getRepository(Estado);

  const userCount = await userRepo.count();
  if (userCount > 0) return;

  await estadoRepo.save(
    estadoRepo.create({ id: 980, nome: 'Ceará', sigla: 'CE' }),
  );

  await cityRepo.save({
    id: 983,
    nome: 'Fortaleza',
    estado_id: 980,
  });

  await userRepo.save({
    id: ulid(),
    nome: 'Ana Beatriz',
    nome_social: '',
    use_nome_social: false,
    pcd: false,
    pcd_tipo: 'nenhum',
    sexo: SexoType.F,
    raca: RacaType.PRETO,
    email: 'ana.beatriz@example.com',
    telefone: '7133334444',
    celular: '71988889999',
    password: 'senhaAna123',
    activated: true,
    cidade_id: 983,
  });
  await userRepo.save({
    id: ulid(),
    nome: 'Carlos Eduardo',
    nome_social: 'Cadu',
    use_nome_social: true,
    pcd: false,
    pcd_tipo: 'nenhum',
    sexo: SexoType.M,
    raca: RacaType.PARDO,
    email: 'carlos.edu@example.com',
    telefone: '7144445555',
    celular: '71911112222',
    password: 'senhaCarlos321',
    activated: true,
    cidade_id: 983,
  });
  await userRepo.save({
    id: ulid(),
    nome: 'Fernanda Lima',
    nome_social: '',
    use_nome_social: false,
    pcd: true,
    pcd_tipo: 'visual',
    sexo: SexoType.F,
    raca: RacaType.BRANCO,
    email: 'fernanda.lima@example.com',
    telefone: '7155556666',
    celular: '71922223333',
    password: 'fernanda2024',
    activated: true,
    cidade_id: 983,
  });
  await userRepo.save({
    id: ulid(),
    nome: 'José Roberto',
    nome_social: '',
    use_nome_social: false,
    pcd: false,
    pcd_tipo: 'nenhum',
    sexo: SexoType.M,
    raca: RacaType.INDIGENA,
    email: 'jose.roberto@example.com',
    telefone: '7166667777',
    celular: '71933334444',
    password: 'jose123456',
    activated: true,
    cidade_id: 983,
  });
};
