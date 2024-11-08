import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class ProductUpdateReq {
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ required: false, type: [Number] })
  categoryIds?: number[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  colorId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  romId?: number;
}
