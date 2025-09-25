import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from '@/utils/database/typeorm.config';
import { UsersService } from '@/users/users.service';
import { TokenService } from '@/token/token.service';
import { MailService } from '@/mail/mail.service';
import { PinoLogger } from 'nestjs-pino';
import { User } from '@/users/entities/user.entity';
import { State } from '@/states/entities/state.entity';
import { City } from './entities/city.entity';

describe('CitiesController', () => {
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };
  let controller: CitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        CitiesService,
        { provide: 'BullQueue_users', useValue: { add: jest.fn() } },
        {
          provide: PinoLogger,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            fatal: jest.fn(),
            trace: jest.fn(),
          },
        },
        UsersService,
        TokenService,
        { provide: MailService, useValue: mockMailService },
      ],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, State, City]),
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
