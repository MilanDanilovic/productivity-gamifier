import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XpService } from './xp.service';
import { XpController } from './xp.controller';
import { XpEvent, XpEventSchema } from '../schemas/xp-event.schema';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: XpEvent.name, schema: XpEventSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [XpController],
  providers: [XpService],
  exports: [XpService],
})
export class XpModule {}

