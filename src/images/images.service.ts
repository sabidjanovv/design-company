import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';import { Image } from './models/image.model';
;

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image)
    private imageModel: typeof Image,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const newImage = await this.imageModel.create(createImageDto);
    return newImage;
  }

  async findAll(): Promise<Image[]> {
    return await this.imageModel.findAll();
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageModel.findByPk(id);
    if (!image) throw new NotFoundException(`Image with id ${id} not found`);
    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(id);
    await image.update(updateImageDto);
    return image;
  }

  async remove(id: number): Promise<{ message: string }> {
    const image = await this.findOne(id);
    await image.destroy();
    return { message: `Image with id ${id} has been removed` };
  }
}
