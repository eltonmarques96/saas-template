import { Controller, Get, Param } from '@nestjs/common';
import { statesService } from './states.service';
import { Public } from '@/utils/decorators/metadata';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('States')
@Controller('states')
export class estadosController {
  constructor(private readonly statesService: statesService) {}

  @Public()
  @Get()
  findAll() {
    return this.statesService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statesService.findOne(+id);
  }
}
