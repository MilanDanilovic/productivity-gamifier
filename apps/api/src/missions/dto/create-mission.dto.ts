import { IsString, IsOptional, IsDateString, IsNumber, Min, IsBoolean, IsEnum } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  questId?: string;

  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  xpValue?: number;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(['DAILY', 'WEEKLY', 'CUSTOM'])
  recurringType?: 'DAILY' | 'WEEKLY' | 'CUSTOM';
}

