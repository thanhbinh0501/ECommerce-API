import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntityModel } from './base.entity';
import { Variant } from './variant.entity';
import { Category } from '@entity/category.entity';
import { ProductCategory } from '@entity/product-category.entity';

@Entity('products')
export class Product extends BaseEntityModel {
  @Column()
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.product)
  productCategories: ProductCategory[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'product_category',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];
}
