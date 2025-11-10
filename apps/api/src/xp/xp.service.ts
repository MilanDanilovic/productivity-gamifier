import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { XpEvent, XpEventDocument } from '../schemas/xp-event.schema';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class XpService {
  constructor(
    @InjectModel(XpEvent.name) private xpEventModel: Model<XpEventDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  calculateLevel(totalXp: number): number {
    return Math.floor(Math.sqrt(totalXp / 100));
  }

  async addXp(
    userId: string,
    amount: number,
    source: 'MISSION' | 'SUBQUEST' | 'BOSSFIGHT' | 'ADMIN' | 'ADJUST',
    sourceId?: string,
  ) {
    const xpEvent = new this.xpEventModel({
      userId: new Types.ObjectId(userId),
      amount,
      source,
      sourceId: sourceId ? new Types.ObjectId(sourceId) : undefined,
    });
    await xpEvent.save();

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.totalXp += amount;
    user.level = this.calculateLevel(user.totalXp);
    await user.save();

    return { xpEvent, newTotalXp: user.totalXp, newLevel: user.level };
  }

  async getEvents(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const events = await this.xpEventModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.xpEventModel
      .countDocuments({ userId: new Types.ObjectId(userId) })
      .exec();

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

