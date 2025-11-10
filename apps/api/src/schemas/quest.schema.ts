import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestDocument = Quest & Document;

@Schema({ timestamps: true })
export class Quest {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['MAIN', 'SUB'] })
  type: 'MAIN' | 'SUB';

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 'ACTIVE', enum: ['ACTIVE', 'COMPLETED', 'ARCHIVED'] })
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

  @Prop()
  startDate?: Date;

  @Prop()
  dueDate?: Date;

  @Prop({
    type: {
      isBoss: Boolean,
      deadline: Date,
      completedOnTime: Boolean,
    },
  })
  bossFight?: {
    isBoss: boolean;
    deadline?: Date;
    completedOnTime?: boolean;
  };
}

export const QuestSchema = SchemaFactory.createForClass(Quest);

QuestSchema.index({ userId: 1, updatedAt: -1 });

