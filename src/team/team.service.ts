import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Team } from './models/team.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team) private teamModel: typeof Team) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = await this.teamModel.create(createTeamDto);
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

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    return await team.update(updateTeamDto);
  }

  async remove(id: number): Promise<{ message: string }> {
    const team = await this.findOne(id);
    await team.destroy();
    return { message: `Team member with id ${id} has been removed` };
  }
}
