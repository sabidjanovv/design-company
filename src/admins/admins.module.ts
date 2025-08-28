import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { Collection } from '../collections/models/collection.model';

@Module({
  imports:[SequelizeModule.forFeature([Admin, Collection])],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
