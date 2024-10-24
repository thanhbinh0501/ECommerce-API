import { Column, Entity } from 'typeorm';
import { BaseEntityModel } from './base.entity';

@Entity('categories')
export class Category extends BaseEntityModel {
  @Column()
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;
}
