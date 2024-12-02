import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'coxinhadefrango',
    });
  }

  async validate(payload: any) {
    console.log('Payload JWT recebido:', payload);
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
