import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MissionDocument = Mission & Document;

@Schema({ timestamps: true })
export class Mission {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Quest' })
  questId?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 'OPEN', enum: ['OPEN', 'DONE'] })
  status: 'OPEN' | 'DONE';

  @Prop({ default: () => new Date() })
  scheduledFor?: Date;

  @Prop({ default: 10 })
  xpValue: number;
}

export const MissionSchema = SchemaFactory.createForClass(Mission);

MissionSchema.index({ userId: 1, updatedAt: -1 });
MissionSchema.index({ userId: 1, scheduledFor: -1 });

