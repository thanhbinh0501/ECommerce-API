import { DataSource, Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Rom } from '@entity/rom.entity';
import { PageRequest } from '@share/page/page-request';
import { Page } from '@share/page/page';

@Injectable()
export class RomRepository extends Repository<Rom> {
  constructor(private readonly dataSource: DataSource) {
    super(Rom, dataSource.createEntityManager());
  }

  async saveEntity(rom: Rom): Promise<Rom> {
    return this.save(this.create(rom));
  }

  async getById(id: number): Promise<Rom> {
    return this.findOneBy({ id });
  }

  async getByValueAndUnit(value: string, unit: "GB" | "TB"): Promise<Rom | null> {
    return this.findOne({
      where: {
        value: value,
        unit: unit,
      }
    });
  }

  async fetchRoms(keyword: string, pageRequest: PageRequest): Promise<Page<Rom>> {
    const condition = keyword ? [{ name: Like(`%${keyword}%`) }] : {};
    const [roms, count] = await this.findAndCount({
      where: condition,
      ...pageRequest,
    });
    return Page.of(roms, count, pageRequest);
  }
}
