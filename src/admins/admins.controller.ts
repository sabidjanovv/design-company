import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './models/admin.model';
import { SuperAdminGuard } from '../common/guards/super-admin.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('Admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // @ApiBearerAuth()
  // @UseGuards(SuperAdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created.',
    type: Admin,
  })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiBearerAuth()
  @UseGuards(SuperAdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({
    status: 200,
    description: 'List of all admins',
    type: [Admin],
  })
  findAll() {
    return this.adminsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get an admin by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Admin ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The admin details',
    type: Admin,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Token is missing or invalid',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - You do not have permission to access this resource',
  })
  @ApiResponse({
    status: 404,
    description: 'Admin not found',
  })
  findOne(@Param('id') id: string, @Request() req) {
    const user = req.user;

    // Role yoki o'zining ID sini tekshirish
    if (user.role !== 'superadmin' && Number(user.id) !== Number(id)) {
      throw new ForbiddenException('Siz bu admin maʼlumotini ko‘ra olmaysiz');
    }

    return this.adminsService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an admin by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({
    status: 200,
    description: 'The admin has been successfully updated.',
    type: Admin,
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto, @Request() req) {
    const user = req.user;

    // Role yoki o'zining ID sini tekshirish
    if (user.role !== 'superadmin' && Number(user.id) !== Number(id)) {
      throw new ForbiddenException('Siz bu admin maʼlumotini o‘zgartira olmaysiz');
    }
    return this.adminsService.update(+id, updateAdminDto);
  }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete an admin by ID' })
  // @ApiParam({ name: 'id', type: Number })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The admin has been successfully deleted.',
  // })
  // @ApiResponse({ status: 404, description: 'Admin not found' })
  // remove(@Param('id') id: string) {
  //   return this.adminsService.remove(+id);
  // }
}
