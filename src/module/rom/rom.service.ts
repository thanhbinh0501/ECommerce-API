import { Injectable } from '@nestjs/common';
import { RomRepository } from './rom.repository';
import { AppLogger } from '@config/logger/app-logger.config';
import { Rom } from '@entity/rom.entity';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';

@Injectable()
export class RomService {
  constructor(
    private readonly repository: RomRepository,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(RomService.name);
  }

  async save(rom: Rom): Promise<Rom> {
    this.log.info(`Save rom with data #`, rom);

    return this.repository.saveEntity(rom);
  }

  async getById(id: number): Promise<Rom> {
    this.log.info(`Get rom by id #${id}`);

    return this.repository.getById(id);
  }

  async getBySize(Size: string): Promise<Rom | null> {
    this.log.info(`Get rom by name #${Size}`);

    return this.repository.getBySize(Size);
  }

  async fetchRoms(keyword: string, pageRequest: PageRequest): Promise<Page<Rom>> {
    this.log.info(`Fetch roms by keyword #${keyword} and pageRequest #`, pageRequest);

    return this.repository.fetchRoms(keyword, pageRequest);
  }

  async remove(id: number): Promise<void> {
    this.log.info(`Remove rom with ID #${id}`);
    await this.repository.delete(id);
  }
}