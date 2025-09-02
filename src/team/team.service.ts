import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from './models/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team) private teamModel: typeof Team,
    private readonly minioService: MinioService,
  ) {}

  async create(dto: CreateTeamDto, image?: Express.Multer.File): Promise<Team> {
    let imageUrl: string | null = null;

    if (image) {
      try {
        // faylni MinIO ga yuklash
        imageUrl = await this.minioService.upload(image);
      } catch (err) {
        console.error('Image upload error:', err);
        throw err;
      }
    }

    const team = await this.teamModel.create({
      full_name: dto.full_name,
      position: dto.position,
      description: dto.description,
      phone: dto.phone,
      is_active: dto.is_active ?? true,
      image_url: imageUrl, // saqlaymiz
    });

    return team;
  }

  async findAll(): Promise<Team[]> {
    return await this.teamModel.findAll({
      include: { all: true },
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamModel.findByPk(id, {
      include: { all: true },
    });
    if (!team)
      throw new NotFoundException(`Team member with id ${id} not found`);
    return team;
  }

  async update(
    id: number,
    updateTeamDto: UpdateTeamDto,
    file?: Express.Multer.File,
  ): Promise<Team> {
    const team = await this.findOne(id);

    // Agar yangi fayl kelsa
    if (file) {
      // eski rasmni o‘chirish (agar mavjud bo‘lsa)
      if (team.image_url) {
        await this.minioService.remove(team.image_url);
      }

      // yangi faylni yuklash
      const fileName = await this.minioService.upload(file);

      // image_url ni o‘zgartirish
      updateTeamDto.image_url = fileName;
    }

    return await team.update(updateTeamDto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const team = await this.findOne(id);
    await team.destroy();
    return { message: `Team member with id ${id} has been removed` };
  }
}
