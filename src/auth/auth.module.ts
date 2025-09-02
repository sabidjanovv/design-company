import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from '../admins/models/admin.model';

@Module({
  imports: [JwtModule.register({ global: true }), SequelizeModule.forFeature([Admin])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
