import { Injectable, NotFoundException } from '@nestjs/common';
import { AppLogger } from '@config/logger/app-logger.config';
import { CategoryRepository } from '@module/category/category.repository';
import { Category } from '@entity'
import { DataList } from '@share/data-list/data-list';
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

  async save(category: Partial<Category>): Promise<Category> {
    this.log.info(`Save category by with data #`, category);

    return this.repository.saveEntity(category);
  }

  async getById(id: number): Promise<Category> {
    this.log.info(`Get category by id #${id}`);

    const category = await this.repository.getById(id);
    if (!category) {
      throw new NotFoundException(`Category with id #${id} not found`);
    }

    return category;
  }

  async getBySlug(slug: string): Promise<Category> {
    this.log.info(`Get category by slug #${slug}`);

    const category = await this.repository.getBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Category with slug #${slug} not found`);
    }

    return category;
  }

  async fetchCategories(keyword: string, pageRequest: PageRequest): Promise<Page<Category>> {
    this.log.info(`Fetch categories by keyword #${keyword} and pageRequest #`, pageRequest);

    return this.repository.fetchCategories(keyword, pageRequest);
  }

  async delete(id: number): Promise<void> {
    this.log.info(`Delete category with ID #${id}`);

    await this.repository.delete(id);
  }

  async existsByName(name: string, id?: number): Promise<boolean> {
    this.log.info(`Check category exists by name #${name} and id #${id}`);

    return this.repository.existsByName(name, id);
  }

  async existsBySlug(slug: string, id?: number): Promise<boolean> {
    this.log.info(`Check category exists by slug #${slug} and id #${id}`);

    return this.repository.existsBySlug(slug, id);
  }

  async getAllCategories(): Promise<DataList<Category>> {
    this.log.info('Get all categories for users');

    return this.repository.getAllCategories();
  }
}
