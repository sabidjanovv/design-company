import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Team } from './models/team.model';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [SequelizeModule.forFeature([Team]), MinioModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
