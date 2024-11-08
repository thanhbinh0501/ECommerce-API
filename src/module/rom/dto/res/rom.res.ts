import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class RomRes {
  @Expose()
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  id: number;

  @Expose()
  @ApiProperty()
  size: string;

  @Expose()
  @ApiProperty()
  description: string;
}
