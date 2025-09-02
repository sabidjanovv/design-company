import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from '../admins/models/admin.model';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    SequelizeModule.forFeature([Admin]),
    AdminsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
