import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwt-payload.type';
import { Request } from 'express';
import { AdminsService } from '../../admins/admins.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly adminService: AdminsService, // admin service inject qilindi
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY || 'access_token_key',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<JwtPayload> {
    if (!payload || !payload.id) {
      throw new ForbiddenException('Invalid token');
    }

    let admin;

    if (payload) {
      // Oddiy admin qidirish
      admin = await this.adminService.findById(
        payload.id,
      );
    }

    if (!admin) {
      throw new UnauthorizedException('admin not found');
    }

    return payload;
  }
}
