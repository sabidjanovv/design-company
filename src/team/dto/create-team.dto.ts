import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'John Doe', description: 'Team member full name' })
  full_name: string;

  @ApiProperty({ example: 'Developer', description: 'Position in team' })
  position: string;

  @ApiProperty({
    example: '1',
    description: 'Profile image id',
    required: false,
  })
  image_id: number;

  @ApiProperty({
    example: 'Lorem ipsum description',
    description: 'Short description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Phone number',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    example: true,
    description: 'Is the member active',
    required: false,
  })
  is_active?: boolean;
}
