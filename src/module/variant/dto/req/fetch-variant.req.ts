import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FetchVariantReq {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword: string;
}
