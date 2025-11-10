import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Achievement, AchievementDocument } from '../schemas/achievement.schema';
import { Mission, MissionDocument } from '../schemas/mission.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name)
    private achievementModel: Model<AchievementDocument>,
    @InjectModel(Mission.name) private missionModel: Model<MissionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getUserAchievements(userId: string) {
    return this.achievementModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ awardedAt: -1 })
      .exec();
  }

  async checkAndAwardFirstBlood(userId: string) {
    const existing = await this.achievementModel.findOne({
      userId: new Types.ObjectId(userId),
      code: 'FIRST_BLOOD',
    });

    if (existing) {
      return null;
    }

    const achievement = new this.achievementModel({
      userId: new Types.ObjectId(userId),
      code: 'FIRST_BLOOD',
      title: 'First Blood',
      description: 'Complete your first mission',
      awardedAt: new Date(),
    });

    return achievement.save();
  }

  async checkAndAwardConsistency(userId: string, streakCount: number) {
    const codes = [
      { threshold: 3, code: 'CONSISTENCY_I', title: 'Consistency I', desc: '3-day streak' },
      { threshold: 7, code: 'CONSISTENCY_II', title: 'Consistency II', desc: '7-day streak' },
      { threshold: 30, code: 'CONSISTENCY_III', title: 'Consistency III', desc: '30-day streak' },
    ];

    const awards = [];

    for (const { threshold, code, title, desc } of codes) {
      if (streakCount >= threshold) {
        const existing = await this.achievementModel.findOne({
          userId: new Types.ObjectId(userId),
          code,
        });

        if (!existing) {
          const achievement = new this.achievementModel({
            userId: new Types.ObjectId(userId),
            code,
            title,
            description: desc,
            awardedAt: new Date(),
          });
          await achievement.save();
          awards.push(achievement);
        }
      }
    }

    return awards;
  }

  async checkAndAwardBugSlayer(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const completedToday = await this.missionModel.countDocuments({
      userId: new Types.ObjectId(userId),
      status: 'DONE',
      updatedAt: { $gte: today, $lt: tomorrow },
    });

    if (completedToday >= 10) {
      const existing = await this.achievementModel.findOne({
        userId: new Types.ObjectId(userId),
        code: 'BUG_SLAYER',
      });

      if (!existing) {
        const achievement = new this.achievementModel({
          userId: new Types.ObjectId(userId),
          code: 'BUG_SLAYER',
          title: 'Bug Slayer',
          description: 'Complete 10 tasks in a single day',
          awardedAt: new Date(),
        });
        return achievement.save();
      }
    }

    return null;
  }
}

