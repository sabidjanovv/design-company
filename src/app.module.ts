import { Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ImagesModule } from './images/images.module';
import { CollectionsModule } from './collections/collections.module';
import { CategoriesModule } from './categories/categories.module';
import { MinioModule } from './minio/minio.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    AuthModule,
    AdminsModule,
    CategoriesModule,
    CollectionsModule,
    ImagesModule,
    MinioModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
