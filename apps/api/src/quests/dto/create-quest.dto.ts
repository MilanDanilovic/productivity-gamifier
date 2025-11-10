import { IsEnum, IsString, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class BossFightDto {
  @IsOptional()
  isBoss?: boolean;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class CreateQuestDto {
  @IsEnum(['MAIN', 'SUB'])
  type: 'MAIN' | 'SUB';

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BossFightDto)
  bossFight?: BossFightDto;
}

