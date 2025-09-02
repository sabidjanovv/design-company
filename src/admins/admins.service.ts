import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';

import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './models/admin.model';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin) private adminModel: typeof Admin) {}

  // CREATE
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const hashedPassword = await argon2.hash(createAdminDto.password);
    const admin = await this.adminModel.create({
      ...createAdminDto,
      hashed_password: hashedPassword,
    });
    return admin;
  }

  // GET ALL
  async findAll(): Promise<Admin[]> {
    return this.adminModel.findAll();
  }

  // GET BY ID
  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) throw new NotFoundException(`Admin with ID ${id} not found`);
    return admin;
  }

  // UPDATE
  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);

    if (updateAdminDto.password) {
      updateAdminDto.password = await argon2.hash(updateAdminDto.password);
    }

    await admin.update(updateAdminDto);
    return admin;
  }

  // DELETE
  async remove(id: number): Promise<{ message: string }> {
    const admin = await this.findOne(id);
    await admin.destroy();
    return { message: `Admin with ID ${id} deleted successfully` };
  }
}
