import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RomUpdateReq {
  @IsOptional()
  @ApiProperty({ required: false })
  value: number;

  @IsOptional()
  @ApiProperty({ required: false })
  unit: 'GB' | 'TB';

  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
