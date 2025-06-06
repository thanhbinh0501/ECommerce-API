import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationReq } from '@share/page/request/pagination.req';

export class FetchCategoryReq extends PaginationReq {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword: string;
}
