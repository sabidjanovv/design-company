import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Category } from './models/category.model';
import { AdminGuard } from '../common/guards/admin.guard';
import { PaginationDto } from '../common/pagination/pagination.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [Category],
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('/by-type')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['interior', 'exterior'],
    description: 'Dizayn turi',
  })
  findAllCategories(@Query() paginationDto: PaginationDto) {
    return this.categoriesService.findAllCategories(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category found', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
