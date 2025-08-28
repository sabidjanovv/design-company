import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryRepo: typeof Category) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepo.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryRepo.findAll();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findByPk(id);
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    return await category.update(updateCategoryDto);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await category.destroy();
    return { message: `Category with ID ${id} deleted successfully` };
  }
}
