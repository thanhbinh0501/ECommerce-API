import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntityModel } from './base.entity';
import { Variant } from './variant.entity';

@Entity('roms')
export class Rom extends BaseEntityModel {
  @Column()
  size: string;

  @OneToMany(() => Variant, (variant) => variant.rom)
  variants: Variant[];
}