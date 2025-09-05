import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

// Tipni "declare" qilib qo‘yamiz
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        buffer: Buffer;
        size: number;
        mimetype: string;
        originalname: string;
      }
    }
  }
}

// @Injectable()
// export class MinioService {
//   private readonly minioClient: Minio.Client;
//   private readonly bucketName = 'collections';

//   constructor() {
//     this.minioClient = new Minio.Client({
//       endPoint: 'localhost',
//       port: 9000,
//       useSSL: false,
//       accessKey: 'admin',
//       secretKey: 'admin123',
//     });
//   }

//   async upload(file: Express.Multer.File): Promise<string> {
//     const fileName = Date.now() + '-' + file.originalname;

//     await this.minioClient.putObject(
//       this.bucketName,
//       fileName,
//       file.buffer,
//       file.size,
//       { 'Content-Type': file.mimetype },
//     );

//     return fileName;
//   }

//   async getFileUrl(fileName: string): Promise<string> {
//     return await this.minioClient.presignedGetObject(this.bucketName, fileName);
//   }

//   async remove(fileName: string): Promise<void> {
//     await this.minioClient.removeObject(this.bucketName, fileName);
//   }
// }
@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName = 'collections';

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'minio', // container nomi
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });

  }

  async upload(file: Express.Multer.File): Promise<string> {
    const fileName = Date.now() + '-' + file.originalname;

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    return fileName;
  }

  async getFileUrl(fileName: string): Promise<string> {
    return await this.minioClient.presignedGetObject(this.bucketName, fileName);
  }

  async remove(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
