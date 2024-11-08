import { Injectable } from '@nestjs/common';
import { ColorService } from './color.service'
import { AppLogger } from '@config/logger/app-logger.config';
import { Transactional } from 'typeorm-transactional';
import { CtxReq } from '@security/request-context/request-context.dto';
import { ColorCreateReq } from '@module/color/dto/req/color-create.req';
import { ValidatorException } from '@exception/validator.exception';
import { ErrorCode } from '@share/constant/error-code';
import { Color } from '@entity/color.entity';
import { FetchColorReq } from '@module/color/dto/req/fetch-color.req';
import { Page } from '@share/page/page';
import { PageRequest } from '@share/page/page-request';
import { NotFoundException } from '@exception/not-found.exception';

@Injectable()
export class ColorBloc {
  constructor(
    private readonly colorService: ColorService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(ColorBloc.name);
  }

  @Transactional()
  async createColor({ userId: currentUserId }: CtxReq, req: ColorCreateReq): Promise<number> {
    const { name } = req;
    this.log.info(`Create color with name #${name}`);

    const existColor = await this.colorService.getByName(name);
    if (existColor) {
      throw new ValidatorException(
        `Color with name ${name} already exists`,
        ErrorCode.COLOR_ALREADY_EXIST,
      );
    }

    const color = new Color();
    color.name = name;
    color.createdBy = currentUserId;
    color.updatedBy = currentUserId;

    const savedColor = await this.colorService.save(color);

    return savedColor.id;
  }

  async searchColors(req: FetchColorReq): Promise<Page<Color>> {
    this.log.info(`Fetch all colors by req #`, req);
    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    return this.colorService.fetchColors(keyword, pageRequest);
  }

  async getById(id: number): Promise<Color> {
    this.log.info(`Get color by id #${id}`);
    const color = await this.colorService.getById(id);
    if (!color) {
      throw new NotFoundException(`Color with id ${id} not found`);
    }
    return color;
  }

  @Transactional()
  async updateColor(id: number, req: ColorCreateReq, currentUserId: number): Promise<void> {
    this.log.info(`Update color by id #${id}`);

    const color = await this.getById(id);
    color.name = req.name || color.name;
    color.updatedBy = currentUserId;

    await this.colorService.save(color);
  }

  @Transactional()
  async deleteColor(id: number): Promise<void> {
    this.log.info(`Delete color by id #${id}`);
    const color = await this.colorService.getById(id);

    if (!color) {
      throw new NotFoundException(`Color with id ${id} not found`);
    }

    await this.colorService.remove(id);
  }
}