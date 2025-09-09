import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { PaginationDto } from '../common/pagination/pagination.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryModel.findAll();
  }

  async findAllCategories(paginationDto: PaginationDto) {
    const { type } = paginationDto;

    const where: any = {};
    if (type) {
      where.type = type; // agar filter kerak bo‘lsa
    }

    return await this.categoryModel.findAll({
      where,
      order: [['createdAt', 'DESC']], // misol uchun tartiblash
    });
  }

  async findOne(id: number) {
    const category = await this.categoryModel.findByPk(id);
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
