import { AppLogger } from '@config/logger/app-logger.config';
import { Category } from '@entity/category.entity';
import { CategoryRepository } from '@module/category/category.repository';
import { Injectable } from '@nestjs/common';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';

@Injectable()
export class CategoryService {
  constructor(
    private readonly repository: CategoryRepository,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(CategoryService.name);
  }

  async save(category: Category): Promise<Category> {
    this.log.info(`Save category by with data #`, category);

    return this.repository.saveEntity(category);
  }

  async getById(id: number): Promise<Category> {
    this.log.info(`Get category by id #${id}`);

    return this.repository.getById(id);
  }

  async getByName(name: string): Promise<Category | null> {
    this.log.info(`Get category by name #${name}`);

    return this.repository.getByName(name);
  }

  async fetchCategories(keyword: string, pageRequest: PageRequest): Promise<Page<Category>> {
    this.log.info(`Fetch categories by keyword #${keyword} and pageRequest #`, pageRequest);

    return this.repository.fetchCategories(keyword, pageRequest);
  }
}
