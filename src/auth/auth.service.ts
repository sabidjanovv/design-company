import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../admins/models/admin.model';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { JwtPayload } from '../common/types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signinDto: SignInDto) {
    const { username, password } = signinDto;

    // DB dan adminni topish
    const admin = await this.adminModel.findOne({ where: { username } });
    if (!admin) throw new UnauthorizedException('Username yoki parol xato');

    // Parolni tekshirish
    const isPasswordValid = await argon2.verify(
      admin.hashed_password,
      password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Username yoki parol xato');

    // Token yaratish
    return this.generateToken(admin);
  }

  private async generateToken(admin: Admin) {
    const payload: JwtPayload = {
      id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      is_active: admin.is_active,
      role: admin.role,
      username: admin.username,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
    };
  }

  async adminProfileCheck(access_token: string) {
    try {
      const verified_token = await this.jwtService.verify(access_token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      if (!verified_token) {
        throw new UnauthorizedException('Invalid token provided');
      }
      const admin = await this.adminModel.findOne({
        where: { username: verified_token.username },
      });
      if (!admin) {
        throw new UnauthorizedException(
          'admin not found with the provided token',
        );
      }
      return {
        success: true,
        message: 'admin profile verified successfully',
        admin: {
          id: admin.id,
          username: admin.username,
          first_name: admin.first_name,
          last_name: admin.last_name,
          is_active: admin.is_active,
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token signature');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
}
