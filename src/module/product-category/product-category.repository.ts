import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@entity/product-category.entity';

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repository: Repository<ProductCategory>,
  ) {}

  create(productCategory: Partial<ProductCategory>): ProductCategory {
    return this.repository.create(productCategory);
  }

  async save(productCategory: ProductCategory): Promise<ProductCategory> {
    return this.repository.save(productCategory);
  }

  async find(options?: any): Promise<ProductCategory[]> {
    return this.repository.find(options);
  }

  async remove(productCategories: ProductCategory[]): Promise<void> {
    await this.repository.remove(productCategories);
  }
}
