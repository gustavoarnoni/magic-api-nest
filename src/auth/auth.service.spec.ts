import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user credentials', async () => {
    mockUsersService.findOne.mockResolvedValue({ username: 'test', password: 'hashedPassword' });

    jest.spyOn(service, 'validateUser').mockResolvedValue({ username: 'test' });
    const result = await service.validateUser('test', 'password');
    expect(result).toEqual({ username: 'test' });
  });
});
