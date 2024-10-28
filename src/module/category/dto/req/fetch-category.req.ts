import { ApiProperty } from '@nestjs/swagger';
import { PaginationReq } from '@share/page/request/pagination.req';
import { IsOptional, IsString } from 'class-validator';

export class FetchCategoryReq extends PaginationReq {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword: string;
}
