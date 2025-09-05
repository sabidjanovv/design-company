// src/categories/dto/create-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { CategoryType } from '../../common/enums/enum';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Technology',
    description: 'Kategoriya nomi',
  })
  @IsString({ message: 'name faqat string bo‘lishi kerak' })
  @IsNotEmpty({ message: 'name bo‘sh bo‘lishi mumkin emas' })
  @Length(2, 50, { message: 'name uzunligi 2-50 oraliqda bo‘lishi kerak' })
  name: string;

  @ApiProperty({
    example: CategoryType.INTERIOR,
    description: 'Kategoriya turi',
    enum: CategoryType,
    enumName: 'CategoryType',
  })
  @IsEnum(CategoryType, {
    message: 'type faqat enum qiymatlaridan biri bo‘lishi kerak',
  })
  type: CategoryType;
}
