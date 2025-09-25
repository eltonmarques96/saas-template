/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { State } from '@/states/entities/state.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}
  async create(id: number, nome: string, state_id: number): Promise<City> {
    const newCity = new City();
    newCity.id = id;
    newCity.nome = nome;
    newCity.state = { id: state_id } as State;
    const createdCity = await this.cityRepository.save(newCity);
    return createdCity;
  }

  findAll() {
    return `This action returns all cities`;
  }

  async findOne(id: number): Promise<City> {
    const cidade = await this.cityRepository.findOne({ where: { id: id } });
    if (!cidade) {
      throw new NotFoundException(`Cidade not found`);
    }
    return cidade;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} cidade`;
  }

  remove(id: number) {
    return `This action removes a #${id} cidade`;
  }
}
