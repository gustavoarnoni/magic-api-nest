import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from './users.service';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'coxinhadefrango',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, RolesGuard],
})
export class AuthModule {}
