import { Controller, Get, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  async getAchievements(@CurrentUser() user: UserDocument) {
    return this.achievementsService.getUserAchievements(user._id.toString());
  }
}

