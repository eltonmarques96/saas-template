import { Module } from '@nestjs/common';
import { statesService } from './states.service';
import { estadosController } from './states.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { City } from '@/cities/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State, City])],

  controllers: [estadosController],
  providers: [statesService],
})
export class StatesModule {}
