import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type XpEventDocument = XpEvent & Document;

@Schema({ timestamps: true })
export class XpEvent {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['MISSION', 'SUBQUEST', 'BOSSFIGHT', 'ADMIN', 'ADJUST'],
  })
  source: 'MISSION' | 'SUBQUEST' | 'BOSSFIGHT' | 'ADMIN' | 'ADJUST';

  @Prop({ type: Types.ObjectId })
  sourceId?: Types.ObjectId;

  @Prop({ required: true })
  amount: number;
}

export const XpEventSchema = SchemaFactory.createForClass(XpEvent);

XpEventSchema.index({ userId: 1, createdAt: -1 });

