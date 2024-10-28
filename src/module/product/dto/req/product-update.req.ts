import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class ProductUpdateReq {
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiProperty({ required: false })
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, default: 0 })
  quantity?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  color?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, description: 'Dung lượng bộ nhớ ROM (GB)' })
  rom?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, description: 'Dung lượng RAM (GB)' })
  ram?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false, description: 'ID của category liên kết' })
  categoryId?: number;
}
