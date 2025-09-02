import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Collection } from './models/collection.model';
import { PaginationDto } from '../common/pagination/pagination.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('files')) // form-data => files[]
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Yangi kolleksiya yaratish (fayllar bilan)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        added_admin_id: { type: 'number', example: 1 },
        category_id: { type: 'number', example: 2 },
        title: { type: 'string', example: 'Yangi kolleksiya' },
        description: { type: 'string', example: 'Kolleksiya tavsifi' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary', // swagger fayl input sifatida chiqaradi
          },
        },
      },
    },
  })
  async create(
    @Body() createCollectionDto: CreateCollectionDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.collectionsService.create(createCollectionDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kolleksiyalarni olish' })
  @ApiResponse({
    status: 200,
    description: 'Kolleksiyalar ro‘yxati',
    type: [Collection],
  })
  @ApiQuery({
    name: 'category_id',
    required: false,
    type: String,
    description: 'Kategoriya ID bo‘yicha filter',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Qancha kolleksiya olish kerak',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Qaysi sahifa',
  })
  @ApiQuery({
    name: 'orderDir',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Saralash tartibi',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Qidiruv uchun so‘z',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.collectionsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha kolleksiyani olish' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Kolleksiya tafsilotlari',
    type: Collection,
  })
  @ApiResponse({ status: 404, description: 'Kolleksiya topilmadi' })
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(+id);
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'ID bo‘yicha kolleksiyani yangilash' })
  // @ApiParam({ name: 'id', type: Number })
  // @ApiBody({ type: UpdateCollectionDto })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Kolleksiya muvaffaqiyatli yangilandi',
  //   type: Collection,
  // })
  // @ApiResponse({ status: 404, description: 'Kolleksiya topilmadi' })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCollectionDto: UpdateCollectionDto,
  // ) {
  //   return this.collectionsService.update(+id, updateCollectionDto);
  // }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('new_files')) // yangi fayllar uchun
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'ID bo‘yicha kolleksiyani yangilash (rasmlar bilan)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Yangi nom' },
        description: { type: 'string', example: 'Yangilangan tavsif' },
        old_image_ids: {
          type: 'array',
          items: { type: 'number' },
          example: [3, 5],
        },
        new_files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Kolleksiya muvaffaqiyatli yangilandi',
    type: Collection,
  })
  @ApiResponse({ status: 404, description: 'Kolleksiya topilmadi' })
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @UploadedFiles() newFiles: Express.Multer.File[],
  ) {
    return this.collectionsService.update(+id, updateCollectionDto, newFiles);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'ID bo‘yicha kolleksiyani o‘chirish' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Kolleksiya muvaffaqiyatli o‘chirildi',
  })
  @ApiResponse({ status: 404, description: 'Kolleksiya topilmadi' })
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(+id);
  }
}
