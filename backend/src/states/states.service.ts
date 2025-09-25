import { Injectable, NotFoundException } from '@nestjs/common';
import { State } from './entities/state.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class statesService {
  constructor(
    @InjectRepository(State)
    private readonly estadoRepository: Repository<State>,
  ) {}

  async create(id: number, nome: string, sigla: string): Promise<State> {
    const newestado = new State();
    newestado.id = id;
    newestado.nome = nome;
    newestado.sigla = sigla;
    const estado = await this.estadoRepository.save(newestado);
    return estado;
  }

  async findAll(): Promise<any> {
    const estados = await this.estadoRepository
      .createQueryBuilder('state')
      .innerJoin('state.cities', 'city')
      .leftJoinAndSelect('state.cities', 'fullCity')
      .distinct(true)
      .getMany();
    if (!estados) {
      throw new NotFoundException(`States not found`);
    }
    return estados.map((state) => ({
      id: String(state.id),
      nome: state.nome,
      sigla: state.sigla,
      cities: state.cities.map((city) => ({
        id: String(city.id),
        nome: city.nome,
      })),
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} estado`;
  }
}
