// src/categories/dto/create-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Technology',
    description: 'Kategoriya nomi',
  })
  @IsString({ message: 'name faqat string bo‘lishi kerak' })
  @IsNotEmpty({ message: 'name bo‘sh bo‘lishi mumkin emas' })
  @Length(2, 50, { message: 'name uzunligi 2-50 oraliqda bo‘lishi kerak' })
  name: string;
}
