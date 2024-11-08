import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RomUpdateReq {
  @IsOptional()
  @ApiProperty({ required: false })
  size?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
