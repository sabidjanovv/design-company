import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { ImagesModule } from '../images/images.module';
import { CategoriesModule } from '../categories/categories.module';
import { MinioModule } from '../minio/minio.module';
import { Image } from '../images/models/image.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Collection, Image]),
    ImagesModule, // collection ↔ image
    CategoriesModule, // collection ↔ category
    MinioModule, // rasm yuklash
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
