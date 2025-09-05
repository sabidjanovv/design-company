// import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
// import { ImagesService } from './images.service';
// import { CreateImageDto } from './dto/create-image.dto';
// import { UpdateImageDto } from './dto/update-image.dto';
// import { AdminGuard } from '../common/guards/admin.guard';
// import { ApiBearerAuth } from '@nestjs/swagger';

// @Controller('images')
// export class ImagesController {
//   constructor(private readonly imagesService: ImagesService) {}

//   @ApiBearerAuth()
//   @UseGuards(AdminGuard)
//   @Post()
//   create(@Body() createImageDto: CreateImageDto) {
//     return this.imagesService.create(createImageDto);
//   }

//   @Get()
//   findAll() {
//     return this.imagesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.imagesService.findOne(+id);
//   }

//   @ApiBearerAuth()
//   @UseGuards(AdminGuard)
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
//     return this.imagesService.update(+id, updateImageDto);
//   }

//   @ApiBearerAuth()
//   @UseGuards(AdminGuard)
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.imagesService.remove(+id);
//   }
// }
