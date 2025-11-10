import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from '../schemas/user.schema';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  async getRewards(@CurrentUser() user: UserDocument) {
    return this.rewardsService.getUserRewards(user._id.toString());
  }

  @Post(':id/claim')
  async claimReward(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.rewardsService.claimReward(id, user._id.toString());
  }
}

