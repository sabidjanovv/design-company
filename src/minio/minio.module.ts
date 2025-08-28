import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService], // boshqa modullar ishlatishi uchun
})
export class MinioModule {}
