import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Product } from '@entity/product.entity';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private readonly dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async saveEntity(product: Product): Promise<Product> {
    return this.save(this.create(product));
  }

  async getById(id: number): Promise<Product> {
    return this.findOneBy({ id });
  }

  async getByName(name: string): Promise<Product | null> {
    return this.findOneBy({ name });
  }

  async fetchProducts(keyword: string, pageRequest: PageRequest): Promise<Page<Product>> {
    const condition = keyword ? [{ name: Like(`%${keyword}%`) }] : {};
    const [products, count] = await this.findAndCount({
      where: condition,
      ...pageRequest,
    });
    return Page.of(products, count, pageRequest);
  }
}
