import { Injectable } from '@nestjs/common';
import { VariantRepository } from './variant.repository';
import { AppLogger } from '@config/logger/app-logger.config';
import { Variant } from '@entity/variant.entity';
import { PageRequest } from '@share/page/page-request';
import { Page } from '@share/page/page';

@Injectable()
export class VariantService {
  constructor(
    private readonly repository: VariantRepository,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(VariantService.name);
  }

  async save(variant: Variant): Promise<Variant> {
    this.log.info(`Save variant with data #`, variant);
    return this.repository.saveEntity(variant);
  }

  async getById(id: number): Promise<Variant> {
    this.log.info(`Get variant by id #${id}`);
    return this.repository.getById(id);
  }

  async getByProductColorRom(productId: number, colorId: number, romId: number): Promise<Variant | null> {
    this.log.info(`Get variant by productId #${productId}, colorId #${colorId}, romId #${romId}`);
    return this.repository.getByProductColorRom(productId, colorId, romId);
  }

  async fetchVariants(keyword: string, pageRequest: PageRequest): Promise<Page<Variant>> {
    this.log.info(`Fetch variants by keyword #${keyword} and pageRequest #`, pageRequest);
    return this.repository.fetchVariants(keyword, pageRequest);
  }

  async remove(id: number): Promise<void> {
    this.log.info(`Remove variant with ID #${id}`);
    await this.repository.delete(id);
  }
}
