import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Category } from '@entity/category.entity';
import { Color } from '@entity/color.entity';
import { Rom } from '@entity/rom.entity';

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

  @Expose()
  @ApiProperty({ required: false })
  categories: Category[];

  @Expose()
  @ApiProperty({ required: false })
  color: Color;

  @Expose()
  @ApiProperty({ required: false })
  rom: Rom;
}
