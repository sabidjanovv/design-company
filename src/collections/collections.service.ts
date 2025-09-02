import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { MinioService } from '../minio/minio.service';
import { Image } from '../images/models/image.model';
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
    return this.collectionRepo.findAll({
      include: [
        { model: Image, as: 'mainImage' }, // asosiy rasm
        { model: Image, as: 'images' }, // barcha rasmlar
      ],
    });
  }

  findOne(id: number) {
    return this.collectionRepo.findByPk(id, {
      include: [
        { model: Image, as: 'mainImage' }, // asosiy rasm
        { model: Image, as: 'images' }, // barcha rasmlar
      ],
    });
  }

  // update(id: number, updateCollectionDto: UpdateCollectionDto) {
  //   return this.collectionRepo.update(updateCollectionDto, { where: { id } });
  // }

  async update(
    id: number,
    updateCollectionDto: UpdateCollectionDto,
    newFiles: Express.Multer.File[],
  ) {
    const collection = await this.collectionRepo.findByPk(id, {
      include: [Image],
    });
    if (!collection) throw new Error('Kolleksiya topilmadi');

    // 1. Matn maydonlarini yangilash
    await collection.update({
      title: updateCollectionDto.title ?? collection.title,
      description: updateCollectionDto.description ?? collection.description,
      category_id: updateCollectionDto.category_id ?? collection.category_id,
    });

    // Flag: asosiy rasm o‘chirildimi?
    let mainImageDeleted = false;

    // 2. Eski rasmlarni o‘chirish
    if (updateCollectionDto.old_image_ids) {

      let ids: number[] = [];
      if (typeof updateCollectionDto.old_image_ids === 'string') {
        ids = updateCollectionDto.old_image_ids
          .split(',')
          .map((id) => +id)
          .filter((id) => !isNaN(id));
      } else if (Array.isArray(updateCollectionDto.old_image_ids)) {
        ids = updateCollectionDto.old_image_ids.map((id) => +id);
      }

      for (const imageId of ids) {
        const image = await this.imageRepo.findByPk(imageId);
        if (image && image.collection_id === collection.id) {
          // agar asosiy rasm o‘chirilayotgan bo‘lsa, flagni true qilamiz
          if (collection.main_image_id === image.id) {
            mainImageDeleted = true;
          }

          await this.minioService.remove(image.image_url);
          await image.destroy();
        }
      }
    }

    // 3. Yangi rasmlar yuklash
    if (newFiles?.length) {
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        try {
          const fileName = await this.minioService.upload(file);
          const image = await this.imageRepo.create({
            collection_id: collection.id,
            image_url: fileName,
          });

          // agar asosiy rasm o‘chirildimi yoki yo‘qmi tekshiramiz
          if (mainImageDeleted && i === 0) {
            // o‘chirildi va birinchi yangi rasm → asosiy qilib qo‘yamiz
            collection.main_image_id = image.id;
            await collection.save();
            mainImageDeleted = false; // qayta belgilamaslik uchun
          } else if (!collection.main_image_id) {
            // agar umuman asosiy rasm bo‘lmasa, birinchisini asosiy qilamiz
            collection.main_image_id = image.id;
            await collection.save();
          }
        } catch (err) {
          console.error('Xato faylda:', file.originalname, err);
          throw err;
        }
      }
    }

    return this.collectionRepo.findByPk(id, { include: [Image] });
  }

  remove(id: number) {
    return this.collectionRepo.destroy({ where: { id } });
  }
}
