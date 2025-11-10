import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestsService } from './quests.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller('quests')
@UseGuards(JwtAuthGuard)
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post()
  async create(
    @Body() createQuestDto: CreateQuestDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.questsService.create(user._id.toString(), createQuestDto);
  }

  @Get()
  async findAll(
    @CurrentUser() user: UserDocument,
    @Query('type') type?: 'MAIN' | 'SUB',
    @Query('status') status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED',
  ) {
    return this.questsService.findAll(user._id.toString(), type, status);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.questsService.update(id, user._id.toString(), updateQuestDto);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.questsService.complete(id, user._id.toString());
  }
}

