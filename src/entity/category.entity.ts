import { Column, Entity } from 'typeorm';

import { BaseEntityModel } from './base.entity';

@Entity('categories')
export class Category extends BaseEntityModel {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;
}
