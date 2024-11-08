import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class VariantUpdateReq {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  colorId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  romId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  price?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  stock?: number;
}
