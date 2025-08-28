import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { AdminRole } from '../../common/enums/admins-role.enum';

export class CreateAdminDto {
  @ApiProperty({
    description: 'First name of the admin',
    example: 'Sardor',
  })
  @IsString({ message: 'First name must be a string' })
  @Length(3, 50, {
    message: 'First name length must be between 3 and 50 characters',
  })
  first_name: string;

  @ApiProperty({
    description: 'Last name of the admin',
    example: 'Sobidjonov',
  })
  @IsString({ message: 'Last name must be a string' })
  @Length(3, 50, {
    message: 'Last name length must be between 3 and 50 characters',
  })
  last_name: string;

  @ApiProperty({
    description: 'Unique username of the admin (used for login)',
    example: 'sardor',
  })
  @IsString({ message: 'Username must be a string' })
  @Length(3, 50, {
    message: 'Username length must be between 3 and 50 characters',
  })
  username: string;

  @ApiProperty({
    description: 'Whether the admin is active or not',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'is_active must be a boolean' })
  @IsOptional()
  is_active?: boolean = true;

  @ApiProperty({
    description: 'Role of the admin',
    example: 'admin',
    enum: AdminRole,
  })
  @IsEnum(AdminRole, { message: 'Role must be a valid AdminRole' })
  role: AdminRole;

  @ApiProperty({
    description: 'Password for the admin account',
    example: 'admin123',
  })
  @IsString({ message: 'Password must be a string' })
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  password: string;
}
