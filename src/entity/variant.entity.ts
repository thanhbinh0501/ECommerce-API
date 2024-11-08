import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntityModel } from '@entity/base.entity';
import { Product } from '@entity/product.entity';
import { Color } from '@entity/color.entity';
import { Rom } from '@entity/rom.entity';

@Entity('variants')
export class Variant extends BaseEntityModel{
  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @ManyToOne(() => Color, (color) => color.variants)
  color: Color;

  @ManyToOne(() => Rom, (rom) => rom.variants)
  rom: Rom;

  @Column('decimal',{
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column('int')
  stock: number;
}