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

    // Default avatar item rewards
    const defaultRewards = [
      { threshold: 100, title: 'Starter Skin', itemType: 'SKIN', icon: '🎨', color: '#4ade80' },
      { threshold: 500, title: 'Warrior Hat', itemType: 'HAT', icon: '🎩', color: '#f59e0b' },
      { threshold: 1000, title: 'Power Sword', itemType: 'WEAPON', icon: '⚔️', color: '#3b82f6' },
      { threshold: 2500, title: 'Shield of Protection', itemType: 'SHIELD', icon: '🛡️', color: '#8b5cf6' },
      { threshold: 5000, title: 'Crown of Legends', itemType: 'ACCESSORY', icon: '👑', color: '#ec4899' },
      { threshold: 10000, title: 'Legendary Armor', itemType: 'SKIN', icon: '🦾', color: '#fbbf24' },
    ];
    const existingThresholds = rewards.map((r) => r.xpThreshold);

    // Create missing default rewards in database
    const missingRewards = defaultRewards.filter(
      (reward) => !existingThresholds.includes(reward.threshold),
    );

    for (const rewardData of missingRewards) {
      const newReward = new this.rewardModel({
        userId: new Types.ObjectId(userId),
        title: rewardData.title,
        xpThreshold: rewardData.threshold,
        itemType: rewardData.itemType,
        icon: rewardData.icon,
        color: rewardData.color,
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

