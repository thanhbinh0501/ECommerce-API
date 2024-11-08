import { Injectable } from '@nestjs/common';
import { RomService } from './rom.service';
import { Transactional } from 'typeorm-transactional';
import { CtxReq } from '@security/request-context/request-context.dto';
import { NotFoundException } from '@exception/not-found.exception';
import { PageRequest } from '@share/page/page-request';
import { Rom } from '@entity/rom.entity';
import { Page } from '@share/page/page';
import { RomCreateReq } from './dto/req/rom-create.req';
import { AppLogger } from '@config/logger/app-logger.config';
import { ErrorCode } from '@share/constant/error-code';
import { ValidatorException } from '@exception/validator.exception';
import { FetchRomReq } from './dto/req/fetch-rom.req';

@Injectable()
export class RomBloc {
  constructor(
    private readonly romService: RomService,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(RomBloc.name);
  }

  @Transactional()
  async createRom({ userId: currentUserId }: CtxReq, req: RomCreateReq): Promise<number> {
    const { value, unit, description } = req;
    this.log.info(`Create ROM with name #${value}${unit} and description #${description}`);

    const existRom = await this.romService.getByValueAndUnit(value, unit);
    if (existRom) {
      throw new ValidatorException(
        `ROM with name ${value}${unit} already exists`,
        ErrorCode.ROM_ALREADY_EXISTS,
      );
    }

    const rom = new Rom();
    rom.value = value;
    rom.unit = unit;
    rom.createdBy = currentUserId;
    rom.updatedBy = currentUserId;

    const savedRom = await this.romService.save(rom);

    return savedRom.id;
  }

  async searchRoms(req: FetchRomReq): Promise<Page<Rom>> {
    this.log.info(`Fetch all roms by req #`, req);
    const { keyword } = req;
    const pageRequest = PageRequest.ofRequest(req);
    return this.romService.fetchRoms(keyword, pageRequest);
  }

  async getById(id: number): Promise<Rom> {
    this.log.info(`Get rom by id #${id}`);
    const rom = await this.romService.getById(id);
    if (!rom) {
      throw new NotFoundException(`Rom with id ${id} not found`);
    }
    return rom;
  }

  async getByValueAndUnit(value: string, unit: 'GB' | 'TB'): Promise<Rom | null> {
    this.log.info(`Get rom by value: ${value} and unit: ${unit}`);
    const rom = await this.romService.getByValueAndUnit(value, unit);
    if (!rom) {
      throw new NotFoundException(`Rom with value ${value} and unit ${unit} not found`);
    }
    return rom;
  }

  @Transactional()
  async updateRom(id: number, req: RomCreateReq, currentUserId: number): Promise<void> {
    this.log.info(`Update rom by id #${id}`);

    const rom = await this.getById(id);
    rom.value = req.value || rom.value;
    rom.unit = req.unit || rom.unit;
    rom.updatedBy = currentUserId;

    await this.romService.save(rom);
  }

  @Transactional()
  async deleteRom(id: number): Promise<void> {
    this.log.info(`Delete rom by id: ${id}`);
    const rom = await this.romService.getById(id);

    if (!rom) {
      throw new Error(`Rom with id ${id} not found.`);
    }

    await this.romService.remove(id);
    this.log.info(`Rom with id ${id} successfully deleted.`);
  }
}
