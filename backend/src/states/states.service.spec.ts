import { Test, TestingModule } from '@nestjs/testing';
import { statesService } from './states.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/utils/database/typeorm.config';
import { User } from '@/users/entities/user.entity';
import { State } from './entities/state.entity';

describe('estadosService', () => {
  let service: statesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [statesService],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, State]),
      ],
    }).compile();

    service = module.get<statesService>(statesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should list all the estados', () => {
    expect(service).toBeDefined();
  });
});
