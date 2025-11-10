import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestsModule } from './quests/quests.module';
import { MissionsModule } from './missions/missions.module';
import { RewardsModule } from './rewards/rewards.module';
import { AchievementsModule } from './achievements/achievements.module';
import { XpModule } from './xp/xp.module';
import { StreaksModule } from './streaks/streaks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/gamify'),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    UsersModule,
    QuestsModule,
    MissionsModule,
    RewardsModule,
    AchievementsModule,
    XpModule,
    StreaksModule,
  ],
})
export class AppModule {}

