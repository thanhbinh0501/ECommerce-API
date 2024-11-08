import { Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntityModel } from '@entity/base.entity';
import { Category } from '@entity/category.entity';

@Entity('product_categories')
export class ProductCategory extends BaseEntityModel{
  @ManyToOne(() => Product, (product) => product.productCategories)
  product: Product;

  @ManyToOne(() => Category, (category) => category.productCategories)
  category: Category;
}