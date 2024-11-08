import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntityModel } from '@entity/base.entity';
import { Category } from '@entity/category.entity';

@Entity('product_category')
export class ProductCategory extends BaseEntityModel{
  @ManyToOne(() => Product, (product) => product.productCategories, { nullable: false, eager: false })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.productCategories, { nullable: false, eager: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}