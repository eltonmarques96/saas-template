import { Controller, Get, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { Public } from '@/utils/decorators/metadata';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Public()
  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(+id);
  }
}
