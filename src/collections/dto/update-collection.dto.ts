import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateCollectionDto } from './create-collection.dto';
import { IsArray, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @ApiPropertyOptional({
    type: [Number], // massiv qilib ko‘rsatiladi
    description: 'O‘chiriladigan rasm ID-lar ro‘yxati',
    example: [1, 2, 3],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((id) => +id)
        .filter((id) => !isNaN(id));
    }
    return value;
  })
  old_image_ids?: number[] | string;
}
