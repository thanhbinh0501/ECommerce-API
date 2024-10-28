import { Injectable } from '@nestjs/common';
import { AppLogger } from '@config/logger/app-logger.config';
import { Product } from '@entity/product.entity';
import { ProductRepository } from '@module/product/product.repository';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';

@Injectable()
export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(ProductService.name);
  }

  async save(product: Product): Promise<Product> {
    this.log.info(`Save product with data #`, product);

    return this.repository.saveEntity(product);
  }

  async getById(id: number): Promise<Product> {
    this.log.info(`Get product by id #${id}`);

    return this.repository.getById(id);
  }

  async getByName(name: string): Promise<Product | null> {
    this.log.info(`Get product by name #${name}`);

    return this.repository.getByName(name);
  }

  async fetchProducts(keyword: string, pageRequest: PageRequest): Promise<Page<Product>> {
    this.log.info(`Fetch products by keyword #${keyword} and pageRequest #`, pageRequest);

    return this.repository.fetchProducts(keyword, pageRequest);
  }
}
