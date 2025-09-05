import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
// import { ImagesController } from './images.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './models/image.model';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Image]),
    MinioModule, // minio servisni ulash
  ],
  controllers: [],
  providers: [ImagesService],
  exports: [ImagesService], // agar collection ishlatmoqchi bo‘lsa
})
export class ImagesModule {}
