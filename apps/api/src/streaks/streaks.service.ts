import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class StreaksService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateStreak(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.lastActivityAt
      ? new Date(user.lastActivityAt)
      : null;
    const lastActivityDate = lastActivity
      ? new Date(lastActivity.setHours(0, 0, 0, 0))
      : null;

    if (!lastActivityDate || lastActivityDate.getTime() < today.getTime()) {
      const daysDiff = lastActivityDate
        ? Math.floor(
            (today.getTime() - lastActivityDate.getTime()) /
              (1000 * 60 * 60 * 24),
          )
        : 0;

      if (daysDiff === 0 || daysDiff === 1) {
        // Same day or next day - increment streak
        user.streakCount += 1;
      } else {
        // Gap > 1 day - reset streak
        user.streakCount = 1;
      }

      user.lastActivityAt = new Date();
      await user.save();
    }
  }
}

