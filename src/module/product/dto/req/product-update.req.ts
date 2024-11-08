import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProductUpdateReq {
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
