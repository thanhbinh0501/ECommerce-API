import { Injectable } from '@nestjs/common';
import { DataSource, Like, Not, Repository } from 'typeorm';

import { DataList } from '@share/data-list/data-list';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';
import { Category } from '@entity';


@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async saveEntity(category: Partial<Category>): Promise<Category> {
    return this.save(this.create(category));
  }

  async getById(id: number): Promise<Category> {
    return this.findOneBy({ id });
  }

  async getBySlug(slug: string): Promise<Category> {
    return this.findOneBy({ slug });
  }

  async fetchCategories(keyword: string, pageRequest: PageRequest): Promise<Page<Category>> {
    const condition = keyword && [{ name: Like(`%${keyword}%`) }];
    const [categories, count] = await this.findAndCount({
      where: condition,
      ...pageRequest,
    });
    return Page.of(categories, count, pageRequest);
  }

  async existsByName(name: string, id?: number): Promise<boolean> {
    return this.existsBy({ name, ...(id && { id: Not(id) }) });
  }

  async existsBySlug(slug: string, id?: number): Promise<boolean> {
    return this.existsBy({ slug, ...(id && { id: Not(id) }) });
  }

  async getAllCategories(): Promise<DataList<Category>> {
    const [data, total] = await this.findAndCount();

    return DataList.of(data, total);
  }
}
