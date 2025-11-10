import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { QuestsService } from '../quests/quests.service';
import { MissionsService } from '../missions/missions.service';
import { RewardsService } from '../rewards/rewards.service';
import { AchievementsService } from '../achievements/achievements.service';
import { XpService } from '../xp/xp.service';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Achievement } from '../schemas/achievement.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const questsService = app.get(QuestsService);
  const missionsService = app.get(MissionsService);
  const rewardsService = app.get(RewardsService);
  const achievementsService = app.get(AchievementsService);
  const xpService = app.get(XpService);
  const userModel = app.get<Model<any>>(getModelToken(User.name));
  const achievementModel = app.get<Model<any>>(getModelToken(Achievement.name));

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await userModel.deleteMany({});
  await achievementModel.deleteMany({});

  // Create demo user
  console.log('Creating demo user...');
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const user = await usersService.create({
    email: 'demo@demo.dev',
    passwordHash,
    displayName: 'Demo User',
  });

  // Set initial XP and level
  await userModel.findByIdAndUpdate(user._id, {
    totalXp: 130,
    level: Math.floor(Math.sqrt(130 / 100)),
  });

  // Create main quest with boss fight
  console.log('Creating main quest...');
  const bossDeadline = new Date();
  bossDeadline.setDate(bossDeadline.getDate() + 7);

  const mainQuest = await questsService.create(user._id.toString(), {
    type: 'MAIN',
    title: 'Launch MVP',
    description: 'Deploy the gamified productivity app',
    bossFight: {
      isBoss: true,
      deadline: bossDeadline.toISOString(),
    },
  });

  // Create sub-quests
  console.log('Creating sub-quests...');
  const subQuest1 = await questsService.create(user._id.toString(), {
    type: 'SUB',
    title: 'Complete Backend API',
    description: 'Implement all NestJS modules',
  });

  const subQuest2 = await questsService.create(user._id.toString(), {
    type: 'SUB',
    title: 'Build Frontend UI',
    description: 'Create Next.js pages with shadcn components',
  });

  // Create today's missions
  console.log('Creating missions...');
  const today = new Date().toISOString().split('T')[0];

  await missionsService.create(user._id.toString(), {
    title: 'Review code',
    description: 'Review pull requests',
    questId: subQuest1._id.toString(),
    scheduledFor: today,
    xpValue: 10,
  });

  await missionsService.create(user._id.toString(), {
    title: 'Write tests',
    description: 'Add unit tests for auth module',
    questId: subQuest1._id.toString(),
    scheduledFor: today,
    xpValue: 10,
  });

  await missionsService.create(user._id.toString(), {
    title: 'Design dashboard',
    description: 'Create dashboard mockup',
    questId: subQuest2._id.toString(),
    scheduledFor: today,
    xpValue: 10,
  });

  // Create rewards (they'll be auto-created on first fetch, but let's create some explicitly)
  console.log('Creating rewards...');
  await rewardsService.getUserRewards(user._id.toString());

  // Award FIRST_BLOOD achievement
  console.log('Awarding achievements...');
  await achievementsService.checkAndAwardFirstBlood(user._id.toString());

  console.log('Seed completed successfully!');
  console.log('Demo user:');
  console.log('  Email: demo@demo.dev');
  console.log('  Password: demo1234');
  console.log('  Initial XP: 130');

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

