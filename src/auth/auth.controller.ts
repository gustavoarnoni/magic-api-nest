import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; role?: string }) {
    const existingUser = await this.usersService.findOne(body.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    const role = body.role || 'user';
    return this.usersService.createUser(body.username, body.password, role);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    return this.authService.login(user);
  }
}