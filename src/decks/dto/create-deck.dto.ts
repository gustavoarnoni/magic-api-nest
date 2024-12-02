import { IsString, IsOptional } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  readonly commander: string;

  @IsString({ each: true })
  readonly cards: string[];

  @IsString()
  readonly userId: string;

  @IsOptional()
  @IsString()
  readonly userRole?: string;
}
