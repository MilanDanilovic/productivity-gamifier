import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  xpThreshold: number;

  @Prop()
  claimedAt?: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);

RewardSchema.index({ userId: 1, updatedAt: -1 });

