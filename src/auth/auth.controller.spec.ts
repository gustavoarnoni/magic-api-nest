import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a user', async () => {
    mockUsersService.findOne.mockResolvedValue(null);
    mockUsersService.createUser.mockResolvedValue({ id: 1, username: 'test', role: 'user' });

    const result = await controller.register({
      username: 'test',
      password: 'password',
      role: 'user',
    });

    expect(result).toEqual({ id: 1, username: 'test', role: 'user' });
    expect(mockUsersService.createUser).toHaveBeenCalledWith('test', 'password', 'user');
  });
});
