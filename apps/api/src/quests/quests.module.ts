import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { Quest, QuestSchema } from '../schemas/quest.schema';
import { XpModule } from '../xp/xp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quest.name, schema: QuestSchema }]),
    XpModule,
  ],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}

