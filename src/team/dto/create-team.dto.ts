import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'John Doe', description: 'Team member full name' })
  @IsString({ message: 'Full name matn bo‘lishi kerak' })
  @Length(2, 50, {
    message: 'Full name 2 tadan 50 tagacha belgidan iborat bo‘lishi kerak',
  })
  full_name: string;

  @ApiProperty({ example: 'Developer', description: 'Position in team' })
  @IsString({ message: 'Position matn bo‘lishi kerak' })
  position: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Profile image file',
  })
  @IsOptional()
  image_url?: any; // fayl sifatida keladi

  @ApiProperty({
    example: 'Lorem ipsum description',
    description: 'Short description',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description matn bo‘lishi kerak' })
  description?: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('UZ', { message: 'Telefon raqami noto‘g‘ri kiritildi' })
  phone?: string;

  @ApiProperty({
    example: true,
    description: 'Is the member active',
    required: false,
  })
  @IsOptional()
  @IsBoolean({
    message: 'is_active qiymati faqat true yoki false bo‘lishi kerak',
  })
  is_active?: boolean;
}
