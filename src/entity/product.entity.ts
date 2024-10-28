import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntityModel } from './base.entity';
import { Category } from './category.entity';

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
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
  })
  quantity: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  color: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Dung lượng bộ nhớ ROM (GB)',
  })
  rom: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Dung lượng RAM (GB)',
  })
  ram: number;

  @ManyToOne(() => Category, (category) => category.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;
}
