import { Injectable } from '@nestjs/common';
import { AppLogger } from '@config/logger/app-logger.config';
import { Product } from '@entity/product.entity';
import { ProductRepository } from '@module/product/product.repository';
import { Category } from '@entity/category.entity';
import { Color } from '@entity/color.entity';
import { Rom } from '@entity/rom.entity';
import { Variant } from '@entity/variant.entity';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';
import { CategoryRepository } from '@module/category/category.repository';
import { ColorRepository } from '@module/color/color.repository';
import { RomRepository } from '@module/rom/rom.repository';
import { VariantRepository } from '@module/variant/variant.repository';
import { ProductCategoryRepository } from '@module/product-category/product-category.repository';
import { In } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly colorRepository: ColorRepository,
    private readonly romRepository: RomRepository,
    private readonly variantRepository: VariantRepository,
    private readonly productCategoryRepository: ProductCategoryRepository,
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

  async getCategoryById(id: number): Promise<Category | null> {
    this.log.info(`Get category by id #${id}`);

    return this.categoryRepository.findOneBy({ id });
  }

  async getCategoriesByIds(ids: number[]): Promise<Category[]> {
    this.log.info(`Get categories by ids #${ids}`);

    return this.categoryRepository.find({ where: { id: In(ids) } });
  }

  async getColorById(id: number): Promise<Color | null> {
    this.log.info(`Get color by id #${id}`);

    return this.colorRepository.findOneBy({ id });
  }

  async getRomById(id: number): Promise<Rom | null> {
    this.log.info(`Get rom by id #${id}`);

    return this.romRepository.findOneBy({ id });
  }

  async saveVariant(variant: Variant): Promise<Variant> {
    this.log.info(`Save variant with data #`, variant);

    return this.variantRepository.save(variant);
  }

  async fetchProducts(keyword: string, pageRequest: PageRequest): Promise<Page<Product>> {
    this.log.info(`Fetch products by keyword #${keyword} and pageRequest #`, pageRequest);

    return this.repository.fetchProducts(keyword, pageRequest);
  }

  async remove(id: number): Promise<void> {
    this.log.info(`Remove product with ID #${id}`);

    await this.repository.delete(id);
  }

  async createProductCategory(productId: number, categoryId: number, createdBy: number): Promise<void> {
    const productCategory = this.productCategoryRepository.create({
      product: { id: productId } as Product,
      category: { id: categoryId } as Category,
      createdBy,
      updatedBy: createdBy,
    });
    await this.productCategoryRepository.save(productCategory);
    this.log.info(`Product with ID #${productId} linked to category with ID #${categoryId}`);
  }

  async removeProductCategories(productId: number): Promise<void> {
    const productCategories = await this.productCategoryRepository.find({ where: { product: { id: productId } } });
    if (productCategories.length > 0) {
      await this.productCategoryRepository.remove(productCategories);
      this.log.info(`Removed all categories linked to product with ID #${productId}`);
    }
  }
}