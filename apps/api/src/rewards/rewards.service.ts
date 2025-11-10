import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reward, RewardDocument } from '../schemas/reward.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getUserRewards(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const rewards = await this.rewardModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ xpThreshold: 1 })
      .exec();

    // Default reward thresholds if none exist
    const defaultThresholds = [100, 500, 1000, 2500, 5000, 10000];
    const existingThresholds = rewards.map((r) => r.xpThreshold);

    // Create missing default rewards in database
    const missingThresholds = defaultThresholds.filter(
      (threshold) => !existingThresholds.includes(threshold),
    );

    for (const threshold of missingThresholds) {
      const newReward = new this.rewardModel({
        userId: new Types.ObjectId(userId),
        title: `Reward at ${threshold} XP`,
        xpThreshold: threshold,
      });
      await newReward.save();
      rewards.push(newReward);
    }

    // Sort rewards by threshold
    rewards.sort((a, b) => a.xpThreshold - b.xpThreshold);

    // Mark which are claimable
    return rewards.map((reward) => ({
      ...reward.toObject(),
      isClaimable: user.totalXp >= reward.xpThreshold && !reward.claimedAt,
      isLocked: user.totalXp < reward.xpThreshold,
      isClaimed: !!reward.claimedAt,
    }));
  }

  async claimReward(rewardId: string, userId: string) {
    const reward = await this.rewardModel
      .findOne({
        _id: new Types.ObjectId(rewardId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.totalXp < reward.xpThreshold) {
      throw new Error('XP threshold not reached');
    }

    if (reward.claimedAt) {
      return reward; // Already claimed
    }

    reward.claimedAt = new Date();
    return reward.save();
  }
}

