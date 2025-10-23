import { IsString, IsOptional, IsDateString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Team Meeting' })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ example: 'Weekly team sync meeting', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:00 AM', required: false })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({ example: 'Conference Room A', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateEventDto {
  @ApiProperty({ example: 'Updated Team Meeting', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15T11:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ example: '11:00 AM', required: false })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({ example: 'Conference Room B', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}
