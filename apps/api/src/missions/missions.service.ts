import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mission, MissionDocument } from '../schemas/mission.schema';
import { CreateMissionDto } from './dto/create-mission.dto';
import { XpService } from '../xp/xp.service';
import { StreaksService } from '../streaks/streaks.service';
import { AchievementsService } from '../achievements/achievements.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MissionsService {
  constructor(
    @InjectModel(Mission.name) private missionModel: Model<MissionDocument>,
    private xpService: XpService,
    private streaksService: StreaksService,
    private achievementsService: AchievementsService,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createMissionDto: CreateMissionDto) {
    const mission = new this.missionModel({
      userId: new Types.ObjectId(userId),
      ...createMissionDto,
      questId: createMissionDto.questId
        ? new Types.ObjectId(createMissionDto.questId)
        : undefined,
      scheduledFor: createMissionDto.scheduledFor
        ? new Date(createMissionDto.scheduledFor)
        : new Date(),
      xpValue: createMissionDto.xpValue || 10,
    });
    return mission.save();
  }

  async findAll(
    userId: string,
    day?: string,
    status?: 'OPEN' | 'DONE',
  ) {
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (day) {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      filter.scheduledFor = {
        $gte: dayStart,
        $lt: dayEnd,
      };
    }

    if (status) {
      filter.status = status;
    }

    return this.missionModel.find(filter).sort({ scheduledFor: -1 }).exec();
  }

  async findOne(id: string, userId: string) {
    const mission = await this.missionModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
    if (!mission) {
      throw new NotFoundException('Mission not found');
    }
    return mission;
  }

  async markDone(id: string, userId: string) {
    const mission = await this.findOne(id, userId);

    if (mission.status === 'DONE') {
      return mission;
    }

    mission.status = 'DONE';
    await mission.save();

    // Grant XP
    await this.xpService.addXp(
      userId,
      mission.xpValue,
      'MISSION',
      mission._id.toString(),
    );

    // Update streak
    await this.streaksService.updateStreak(userId);

    // Check achievements
    await this.achievementsService.checkAndAwardFirstBlood(userId);
    await this.achievementsService.checkAndAwardBugSlayer(userId);

    // Get updated user for streak count to check consistency achievements
    const user = await this.usersService.findById(userId);
    if (user) {
      await this.achievementsService.checkAndAwardConsistency(
        userId,
        user.streakCount,
      );
    }

    return mission;
  }
}

