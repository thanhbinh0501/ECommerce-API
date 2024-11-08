import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProductRes {
  @Expose()
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;
}
