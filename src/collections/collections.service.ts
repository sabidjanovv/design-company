import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { MinioService } from '../minio/minio.service';
import { Image } from '../images/models/image.model';
;

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection) private collectionRepo: typeof Collection,
    @InjectModel(Image) private imageRepo: typeof Image,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateCollectionDto, files: Express.Multer.File[]) {
    // 1. Avval kolleksiya yozuvi
    const collection = await this.collectionRepo.create({
      added_admin_id: dto.added_admin_id,
      category_id: dto.category_id,
      title: dto.title,
      description: dto.description,
    });

    // 2. Fayllarni MinIO ga yuklash
    for (const file of files) {
      try {
        const fileName = await this.minioService.upload(file);
        const image = await this.imageRepo.create({
          collection_id: collection.id,
          image_url: fileName,
        });

        if (!collection.main_image_id) {
          collection.main_image_id = image.id;
          await collection.save();
        }
      } catch (err) {
        console.error('Xato faylda:', file.originalname, err);
        throw err;
      }
    }



    return collection;
  }

  findAll() {
    return this.collectionRepo.findAll({ include: [Image] });
  }

  findOne(id: number) {
    return this.collectionRepo.findByPk(id, { include: [Image] });
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return this.collectionRepo.update(updateCollectionDto, { where: { id } });
  }

  remove(id: number) {
    return this.collectionRepo.destroy({ where: { id } });
  }
}
