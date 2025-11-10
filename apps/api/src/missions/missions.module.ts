import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MissionsService } from './missions.service';
import { MissionsController } from './missions.controller';
import { Mission, MissionSchema } from '../schemas/mission.schema';
import { XpModule } from '../xp/xp.module';
import { StreaksModule } from '../streaks/streaks.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mission.name, schema: MissionSchema }]),
    XpModule,
    StreaksModule,
    AchievementsModule,
    UsersModule,
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [MissionsService],
})
export class MissionsModule {}

