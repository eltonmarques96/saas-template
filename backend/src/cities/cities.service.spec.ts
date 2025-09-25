import { Test, TestingModule } from '@nestjs/testing';
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

describe('CitiesService', () => {
  let service: CitiesService;
  const mockMailService = {
    sendUserConfirmation: jest.fn(),
    sendPasswordRecovery: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: MailService, useValue: mockMailService },
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
      ],
      imports: [
        TypeOrmModule.forRoot(getTypeOrmConfig()),
        TypeOrmModule.forFeature([User, State, City]),
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
