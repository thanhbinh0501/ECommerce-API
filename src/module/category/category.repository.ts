import { Category } from '@entity/category.entity';
import { Injectable } from '@nestjs/common';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';
import { DataSource, Like, Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async saveEntity(category: Category): Promise<Category> {
    return this.save(this.create(category));
  }

  async getById(id: number): Promise<Category> {
    return this.findOneBy({ id });
  }

  async getByName(name: string): Promise<Category> {
    return this.findOneBy({ name });
  }

  async fetchCategories(keyword: string, pageRequest: PageRequest): Promise<Page<Category>> {
    const condition = keyword && [{ name: Like(`%${keyword}%`) }];
    const [categories, count] = await this.findAndCount({
      where: condition,
      ...pageRequest,
    });
    return Page.of(categories, count, pageRequest);
  }
}
