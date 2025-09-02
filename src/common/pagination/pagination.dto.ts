import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Sort } from '../enums/enum';

export class PaginationDto {
  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsEnum(Sort)
  orderDir?: Sort;

  @IsOptional()
  @IsString()
  search?: string;
}
