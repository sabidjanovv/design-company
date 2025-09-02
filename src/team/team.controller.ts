import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Team } from './models/team.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new team member (with image)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: { type: 'string', example: 'John Doe' },
        position: { type: 'string', example: 'Developer' },
        description: { type: 'string', example: 'Short bio' },
        phone: { type: 'string', example: '+998901234567' },
        is_active: { type: 'boolean', example: true },
        image: {
          type: 'string',
          format: 'binary', // swagger’da fayl tanlash ko‘rinadi
        },
      },
    },
  })
  async create(
    @Body() createTeamDto: CreateTeamDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.teamService.create(createTeamDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all team members' })
  @ApiResponse({
    status: 200,
    description: 'List of team members',
    type: [Team],
  })
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one team member by id' })
  @ApiResponse({ status: 200, description: 'Team member', type: Team })
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file')) // form-data => file
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a team member (with optional new image)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: { type: 'string', example: 'Jane Doe' },
        position: { type: 'string', example: 'Designer' },
        description: { type: 'string', example: 'Updated description' },
        phone: { type: 'string', example: '+998901112233' },
        is_active: { type: 'boolean', example: true },
        file: { type: 'string', format: 'binary' }, // swagger file input
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Updated team member', type: Team })
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.teamService.update(+id, updateTeamDto, file);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove a team member by id' })
  @ApiResponse({ status: 200, description: 'Deleted team member' })
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
