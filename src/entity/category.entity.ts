import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityModel } from './base.entity';
import { Product } from '@entity/product.entity';
import { ProductCategory } from '@entity/product-category.entity';


@Entity('categories')
export class Category extends BaseEntityModel {
  @Column()
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.category)
  productCategories: ProductCategory[];

  @OneToMany(() => Product, (product) => product.categories)
  products: Product[];
}
