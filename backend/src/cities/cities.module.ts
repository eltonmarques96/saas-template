import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '@/users/users.module';
import { City } from './entities/city.entity';
import { State } from '@/states/entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State, City]), UsersModule],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
