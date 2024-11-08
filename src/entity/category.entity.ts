import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityModel } from './base.entity';
import { ProductCategory } from './product-category.entity';
import { Product } from '@entity/product.entity';


@Entity('categories')
export class Category extends BaseEntityModel {
  @Column()
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.category, { cascade: true })
  productCategories: ProductCategory[];
}
