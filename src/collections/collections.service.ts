import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Collection } from './models/collection.model';
import { MinioService } from '../minio/minio.service';
import { Image } from '../images/models/image.model';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Category } from '../categories/models/category.model';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection) private collectionModel: typeof Collection,
    @InjectModel(Image) private imageRepo: typeof Image,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly minioService: MinioService,
  ) {}

  // async create(dto: CreateCollectionDto, files: Express.Multer.File[]) {
  //   // 1. Avval kolleksiya yozuvi
  //   const collection = await this.collectionModel.create({
  //     added_admin_id: dto.added_admin_id,
  //     category_id: dto.category_id,
  //     title: dto.title,
  //     description: dto.description,
  //   });

  //   // 2. Fayllarni MinIO ga yuklash
  //   for (const file of files) {
  //     try {
  //       const fileName = await this.minioService.upload(file);
  //       const image = await this.imageRepo.create({
  //         collection_id: collection.id,
  //         image_url: fileName,
  //       });

  //       if (!collection.main_image_id) {
  //         collection.main_image_id = image.id;
  //         await collection.save();
  //       }
  //     } catch (err) {
  //       console.error('Xato faylda:', file.originalname, err);
  //       throw err;
  //     }
  //   }

  //   return collection;
  // }

  async create(dto: CreateCollectionDto, files: Express.Multer.File[]) {
    const transaction = await this.sequelize.transaction();

    try {
      // 1. Avval transaction ichida collection yaratish
      const collection = await this.collectionModel.create(
        {
          added_admin_id: dto.added_admin_id,
          category_id: dto.category_id,
          title: dto.title,
          description_uz: dto.description_uz,
          description_ru: dto.description_ru,
          description_en: dto.description_en,
        },
        { transaction },
      );

      // 2. Fayllarni yuklash
      for (const file of files) {
        const fileName = await this.minioService.upload(file);
        const image = await this.imageRepo.create(
          {
            collection_id: collection.id,
            image_url: fileName,
          },
          { transaction },
        );

        if (!collection.main_image_id) {
          collection.main_image_id = image.id;
          await collection.save({ transaction });
        }
      }

      // 🔥 hammasi muvaffaqiyatli bo‘lsa
      await transaction.commit();
      return collection;
    } catch (err) {
      await transaction.rollback(); // ❌ xato bo‘lsa collection ham saqlanmaydi
      throw err;
    }
  }

  // async findAll(paginationDto: PaginationDto) {
  //   const {
  //     page = 1,
  //     limit = 20,
  //     category_id,
  //     search,
  //     orderDir,
  //     type, // enum('interior', 'exterior')
  //     lang
  //   } = paginationDto;

  //   const offset = (page - 1) * limit;

  //   const where: any = {};

  //   if (category_id) {
  //     where.category_id = category_id;
  //   }

  //   if (search) {
  //     where.title = { [Op.iLike]: `%${search}%` };
  //   }

  //   // category shartlarini ajratib olish
  //   const categoryWhere: any = {};
  //   if (type) {
  //     categoryWhere.type = type;
  //   }

  //   const collections = await this.collectionModel.findAndCountAll({
  //     where,
  //     distinct: true,
  //     include: [
  //       { model: Image, as: 'mainImage' },
  //       { model: Image, as: 'images' },
  //       {
  //         model: Category,
  //         as: 'category',
  //         where: Object.keys(categoryWhere).length ? categoryWhere : undefined,
  //       },
  //     ],
  //     limit,
  //     offset,
  //     order: [['createdAt', orderDir || 'DESC']],
  //   });

  //   return {
  //     statusCode: 200,
  //     message: 'Collections fetched successfully',
  //     data: {
  //       total: collections.count,
  //       page,
  //       limit,
  //       items: collections.rows,
  //     },
  //   };
  // }

  async findAll(paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 20,
      category_id,
      search,
      orderDir,
      type, // enum('interior', 'exterior')
      lang = 'ru', // default ru
    } = paginationDto;

    const offset = (page - 1) * limit;

    const where: any = {};

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    // category shartlari
    const categoryWhere: any = {};
    if (type) {
      categoryWhere.type = type;
    }

    const collections = await this.collectionModel.findAndCountAll({
      where,
      distinct: true,
      include: [
        { model: Image, as: 'mainImage' },
        { model: Image, as: 'images' },
        {
          model: Category,
          as: 'category',
          where: Object.keys(categoryWhere).length ? categoryWhere : undefined,
        },
      ],
      limit,
      offset,
      order: [['createdAt', orderDir || 'DESC']],
    });

    // description_lang ni qo‘shib qaytarish
    const items = collections.rows.map((c: any) => ({
      ...c.toJSON(),
      description: c[`description_${lang}`] || c.description_ru, // fallback ru
    }));

    return {
      statusCode: 200,
      message: 'Collections fetched successfully',
      data: {
        total: collections.count,
        page,
        limit,
        items,
      },
    };
  }

  async findByCategoryId(category_id: number, paginationDto: PaginationDto) {
    const {
      page = 1,
      limit = 20,
      orderDir,
      lang = 'ru', // default ru
    } = paginationDto;

    const offset = (page - 1) * limit;

    const collections = await this.collectionModel.findAndCountAll({
      where: { category_id },
      distinct: true,
      col: 'id',
      include: [
        { model: Image, as: 'mainImage' },
        { model: Image, as: 'images' },
        {
          model: Category,
          as: 'category',
        },
      ],
      limit,
      offset,
      order: [['createdAt', orderDir || 'DESC']],
    });

    // description_lang ni qo‘shib qaytarish
    const items = collections.rows.map((c: any) => ({
      ...c.toJSON(),
      description: c[`description_${lang}`] || c.description_ru,
    }));

    return {
      statusCode: 200,
      message: 'Collections by category fetched successfully',
      data: {
        total: collections.count,
        page,
        limit,
        items,
      },
    };
  }

  async findOne(id: number, paginationDto: PaginationDto) {
    const { lang = 'ru' } = paginationDto; // default ru

    const collection = await this.collectionModel.findByPk(id, {
      include: [
        { model: Image, as: 'mainImage' }, // asosiy rasm
        { model: Image, as: 'images' }, // barcha rasmlar
      ],
    });

    if (!collection) {
      return {
        statusCode: 404,
        message: 'Collection not found',
      };
    }

    return {
      statusCode: 200,
      message: 'Collection fetched successfully',
      data: {
        ...collection.toJSON(),
        description: collection[`description_${lang}`],
      },
    };
  }

  async update(
    id: number,
    updateCollectionDto: UpdateCollectionDto,
    newFiles: Express.Multer.File[],
  ) {
    const collection = await this.collectionModel.findByPk(id, {
      include: [Image],
    });
    if (!collection) throw new Error('Kolleksiya topilmadi');

    // 1. Matn maydonlarini yangilash
    await collection.update({
      title: updateCollectionDto.title ?? collection.title,
      description_uz:
        updateCollectionDto.description_uz ?? collection.description_uz,
      description_ru:
        updateCollectionDto.description_ru ?? collection.description_ru,
      description_en:
        updateCollectionDto.description_en ?? collection.description_en,
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

    return this.collectionModel.findByPk(id, { include: [Image] });
  }

  remove(id: number) {
    return this.collectionModel.destroy({ where: { id } });
  }
}
