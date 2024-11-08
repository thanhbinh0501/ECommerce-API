import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityModel } from '@entity/base.entity';
import { Variant } from '@entity/variant.entity';

@Entity('colors')
export class Color extends BaseEntityModel{
  @Column({})
  name: string;

  @OneToMany(() => Variant, (variant) => variant.color)
  variants: Variant[];
}