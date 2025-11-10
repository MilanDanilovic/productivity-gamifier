import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { XpService } from './xp.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller('xp')
@UseGuards(JwtAuthGuard)
export class XpController {
  constructor(private readonly xpService: XpService) {}

  @Get('events')
  async getEvents(
    @CurrentUser() user: UserDocument,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.xpService.getEvents(
      user._id.toString(),
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }
}

