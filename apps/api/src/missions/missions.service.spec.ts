import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MissionsService } from './missions.service';
import { Mission } from '../schemas/mission.schema';
import { XpService } from '../xp/xp.service';
import { StreaksService } from '../streaks/streaks.service';
import { AchievementsService } from '../achievements/achievements.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('MissionsService', () => {
  let service: MissionsService;
  let missionModel: any;
  let xpService: jest.Mocked<XpService>;
  let streaksService: jest.Mocked<StreaksService>;
  let achievementsService: jest.Mocked<AchievementsService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockMissionModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionsService,
        {
          provide: getModelToken(Mission.name),
          useValue: mockMissionModel,
        },
        {
          provide: XpService,
          useValue: {
            addXp: jest.fn(),
          },
        },
        {
          provide: StreaksService,
          useValue: {
            updateStreak: jest.fn(),
          },
        },
        {
          provide: AchievementsService,
          useValue: {
            checkAndAwardFirstBlood: jest.fn(),
            checkAndAwardBugSlayer: jest.fn(),
            checkAndAwardConsistency: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MissionsService>(MissionsService);
    missionModel = module.get(getModelToken(Mission.name));
    xpService = module.get(XpService);
    streaksService = module.get(StreaksService);
    achievementsService = module.get(AchievementsService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('markDone', () => {
    it('should throw NotFoundException if mission not found', async () => {
      missionModel.findOne.mockResolvedValue(null);

      await expect(
        service.markDone('mission-id', 'user-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should grant XP, update streak, and check achievements when mission is completed', async () => {
      const mockMission = {
        _id: 'mission-id',
        status: 'OPEN',
        xpValue: 10,
        save: jest.fn().mockResolvedValue({}),
      };

      const mockUser = {
        _id: 'user-id',
        streakCount: 5,
      };

      missionModel.findOne.mockResolvedValue(mockMission);
      usersService.findById.mockResolvedValue(mockUser as any);
      xpService.addXp.mockResolvedValue({
        newTotalXp: 100,
        newLevel: 1,
      } as any);

      await service.markDone('mission-id', 'user-id');

      expect(mockMission.status).toBe('DONE');
      expect(mockMission.save).toHaveBeenCalled();
      expect(xpService.addXp).toHaveBeenCalledWith(
        'user-id',
        10,
        'MISSION',
        'mission-id',
      );
      expect(streaksService.updateStreak).toHaveBeenCalledWith('user-id');
      expect(achievementsService.checkAndAwardFirstBlood).toHaveBeenCalledWith('user-id');
      expect(achievementsService.checkAndAwardBugSlayer).toHaveBeenCalledWith('user-id');
      expect(achievementsService.checkAndAwardConsistency).toHaveBeenCalledWith(
        'user-id',
        5,
      );
    });
  });
});

