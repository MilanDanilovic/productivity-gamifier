import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StreaksService } from './streaks.service';
import { User, UserSchema } from '../schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [StreaksService],
  exports: [StreaksService],
})
export class StreaksModule {}

