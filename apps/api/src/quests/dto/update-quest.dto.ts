import { IsEnum, IsString, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BossFightDto {
  @IsOptional()
  isBoss?: boolean;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class UpdateQuestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'COMPLETED', 'ARCHIVED'])
  status?: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BossFightDto)
  bossFight?: BossFightDto;
}

