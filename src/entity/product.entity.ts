import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntityModel } from './base.entity';
import { ProductCategory } from './product-category.entity';
import { Variant } from './variant.entity';
import { Category } from '@entity/category.entity';

@Entity('products')
export class Product extends BaseEntityModel {
  @Column()
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'bigint',
    nullable: true
  })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.product, { cascade: true })
  productCategories: ProductCategory[];

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];
}
