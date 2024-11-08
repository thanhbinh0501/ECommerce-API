import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRes<T> {
  @Expose()
  @ApiProperty()
  page: number;

  @Expose()
  @ApiProperty()
  pageSize: number;

  @Expose()
  @ApiProperty()
  totalRecords: number;

  @Expose()
  @ApiProperty()
  totalPage: number;

  @Expose()
  @ApiProperty({ type: 'array', items: { type: 'object' } })
  records: T[];

  constructor(page: number, pageSize: number, totalRecords: number, totalPage: number, records: T[]) {
    this.page = page;
    this.pageSize = pageSize;
    this.totalRecords = totalRecords;
    this.totalPage = totalPage;
    this.records = records;
  }
}
