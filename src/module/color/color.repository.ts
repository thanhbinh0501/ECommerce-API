import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Color } from '@entity/color.entity';
import { PageRequest } from '@share/page/page-request';
import { Page } from '@share/page/page';

@Injectable()
export class ColorRepository extends Repository<Color> {
  constructor(private readonly dataSource: DataSource) {
    super(Color, dataSource.createEntityManager());
  }

  async saveEntity(color: Color): Promise<Color> {
    return this.save(this.create(color));
  }

  async getById(id: number): Promise<Color> {
    return this.findOneBy({ id });
  }

  async getByName(name: string): Promise<Color> {
    return this.findOneBy({ name });
  }

  async fetchColors(keyword: string, pageRequest: PageRequest): Promise<Page<Color>> {
    const condition = keyword ? [{ name: Like(`%${keyword}%`) }] : {};
    const [colors, count] = await this.findAndCount({
      where: condition,
      ...pageRequest,
    });
    return Page.of(colors, count, pageRequest);
  }
}