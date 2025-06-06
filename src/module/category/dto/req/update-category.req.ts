import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCategoryReq {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ maxLength: 255 })
  name: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ maxLength: 255 })
  slug: string;
}
