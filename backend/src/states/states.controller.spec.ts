import { Test, TestingModule } from '@nestjs/testing';
import { estadosController } from './states.controller';
import { statesService } from './states.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/utils/database/typeorm.config';
import { User } from '@/users/entities/user.entity';
import { State } from './entities/state.entity';

describe('estadosController', () => {
  let controller: estadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [estadosController],
      providers: [statesService],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, State]),
      ],
    }).compile();

    controller = module.get<estadosController>(estadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
