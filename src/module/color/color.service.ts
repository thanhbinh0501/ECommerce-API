import { Injectable } from '@nestjs/common';
import { ColorRepository } from './color.repository'
import { AppLogger } from '@config/logger/app-logger.config';
import { Color } from '@entity/color.entity';
import { PageRequest } from '@share/page/page-request';
import { Page } from '@share/page/page';

@Injectable()
export class ColorService {
  constructor(
    private readonly repository: ColorRepository,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(ColorService.name);
  }

  async save(color: Color): Promise<Color> {
    this.log.info(`Save color with data #`, color);
    return this.repository.saveEntity(color);
  }

  async getById(id: number): Promise<Color> {
    this.log.info(`Get color by id #${id}`);

    return this.repository.getById(id);
  }

  async getByName(name: string): Promise<Color | null> {
    this.log.info(`Get color by name #${name}`);

    return this.repository.getByName(name);
  }

  async fetchColors(keyword: string, pageRequest: PageRequest): Promise<Page<Color>> {
    this.log.info(`Fetch colors by keyword #${keyword} and pageRequest #`, pageRequest);

    return this.repository.fetchColors(keyword, pageRequest);
  }

  async remove(id: number): Promise<void> {
    this.log.info(`Remove color with ID #${id}`);
    await this.repository.delete(id);
  }
}