import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VariantRes {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  productId: number;

  @Expose()
  @ApiProperty()
  colorId: number;

  @Expose()
  @ApiProperty()
  romId: number;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  stock: number;
}
