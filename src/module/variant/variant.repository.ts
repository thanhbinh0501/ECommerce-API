import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Variant } from '@entity/variant.entity';
import { PageRequest } from '@share/page/page-request';
import { Page } from '@share/page/page';

@Injectable()
export class VariantRepository extends Repository<Variant> {
  constructor(private readonly dataSource: DataSource) {
    super(Variant, dataSource.createEntityManager());
  }

  async saveEntity(variant: Variant): Promise<Variant> {
    return this.save(this.create(variant));
  }

  async getById(id: number): Promise<Variant> {
    return this.findOneBy({ id });
  }

  async getByProductColorRom(productId: number, colorId: number, romId: number): Promise<Variant | null> {
    return this.findOne({
      where: {
        product: { id: productId },
        color: { id: colorId },
        rom: { id: romId },
      },
    });
  }

  async fetchVariants(keyword: string, pageRequest: PageRequest): Promise<Page<Variant>> {
    const condition = keyword ? [{ name: Like(`%${keyword}%`) }] : {};
    const [variants, count] = await this.findAndCount({
      where: condition,
      ...pageRequest,
    });
    return Page.of(variants, count, pageRequest);
  }
}
