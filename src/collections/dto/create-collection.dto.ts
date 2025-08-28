import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    example: 1,
    description: 'Kolleksiyani qo‘shgan adminning ID si',
  })
  @IsInt()
  @IsNotEmpty()
  added_admin_id: number;

  @ApiProperty({
    example: 'Yozgi kolleksiya',
    description: 'Kolleksiya nomi',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Ushbu kolleksiya yozgi maxsus mahsulotlardan iborat',
    description: 'Kolleksiya tavsifi',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 10,
    description: 'Asosiy rasm ID si',
  })
  @IsInt()
  @IsNotEmpty()
  main_image_id: number;

  @ApiProperty({
    example: 3,
    description: 'Kolleksiya tegishli kategoriyaning ID si',
  })
  @IsInt()
  @IsNotEmpty()
  category_id: number;
}
