import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ default: 0 })
  totalXp: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  streakCount: number;

  @Prop()
  lastActivityAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ userId: 1, updatedAt: -1 });

