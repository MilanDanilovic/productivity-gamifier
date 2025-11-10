import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quest, QuestDocument } from '../schemas/quest.schema';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { XpService } from '../xp/xp.service';

@Injectable()
export class QuestsService {
  constructor(
    @InjectModel(Quest.name) private questModel: Model<QuestDocument>,
    private xpService: XpService,
  ) {}

  async create(userId: string, createQuestDto: CreateQuestDto) {
    const quest = new this.questModel({
      userId: new Types.ObjectId(userId),
      ...createQuestDto,
      startDate: createQuestDto.startDate
        ? new Date(createQuestDto.startDate)
        : new Date(),
      dueDate: createQuestDto.dueDate
        ? new Date(createQuestDto.dueDate)
        : undefined,
      bossFight: createQuestDto.bossFight
        ? {
            isBoss: createQuestDto.bossFight.isBoss || false,
            deadline: createQuestDto.bossFight.deadline
              ? new Date(createQuestDto.bossFight.deadline)
              : undefined,
          }
        : undefined,
    });
    return quest.save();
  }

  async findAll(
    userId: string,
    type?: 'MAIN' | 'SUB',
    status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED',
  ) {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (type) {
      filter.type = type;
    }
    if (status) {
      filter.status = status;
    }
    return this.questModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string) {
    const quest = await this.questModel
      .findOne({
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId),
      })
      .exec();
    if (!quest) {
      throw new NotFoundException('Quest not found');
    }
    return quest;
  }

  async update(id: string, userId: string, updateQuestDto: UpdateQuestDto) {
    const quest = await this.findOne(id, userId);

    if (updateQuestDto.dueDate) {
      quest.dueDate = new Date(updateQuestDto.dueDate);
    }

    if (updateQuestDto.bossFight) {
      quest.bossFight = {
        isBoss: updateQuestDto.bossFight.isBoss ?? quest.bossFight?.isBoss ?? false,
        deadline: updateQuestDto.bossFight.deadline
          ? new Date(updateQuestDto.bossFight.deadline)
          : quest.bossFight?.deadline,
        completedOnTime: quest.bossFight?.completedOnTime,
      };
    }

    Object.assign(quest, {
      ...updateQuestDto,
      bossFight: quest.bossFight,
      dueDate: quest.dueDate,
    });

    return quest.save();
  }

  async complete(id: string, userId: string) {
    const quest = await this.findOne(id, userId);

    quest.status = 'COMPLETED';

    // Boss fight logic
    if (quest.bossFight?.isBoss && quest.bossFight.deadline) {
      const now = new Date();
      const deadline = new Date(quest.bossFight.deadline);
      const completedOnTime = now <= deadline;

      quest.bossFight.completedOnTime = completedOnTime;

      if (completedOnTime) {
        // Grant bonus XP for on-time boss fight completion
        await this.xpService.addXp(
          userId,
          50,
          'BOSSFIGHT',
          quest._id.toString(),
        );
      }
    } else {
      // Regular quest completion grants XP
      await this.xpService.addXp(
        userId,
        quest.type === 'MAIN' ? 100 : 25,
        'SUBQUEST',
        quest._id.toString(),
      );
    }

    return quest.save();
  }
}

