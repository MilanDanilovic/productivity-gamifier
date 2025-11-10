import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller('missions')
@UseGuards(JwtAuthGuard)
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  async create(
    @Body() createMissionDto: CreateMissionDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.missionsService.create(user._id.toString(), createMissionDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: UserDocument,
    @Query('day') day?: string,
    @Query('status') status?: 'OPEN' | 'DONE',
  ) {
    return this.missionsService.findAll(user._id.toString(), day, status);
  }

  @Post(':id/done')
  async markDone(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.missionsService.markDone(id, user._id.toString());
  }
}

