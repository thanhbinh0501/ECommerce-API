import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class VariantCreateReq {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  productId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  colorId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  romId: number;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  stock: number;
}
