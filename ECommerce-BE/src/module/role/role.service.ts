import { Injectable } from '@nestjs/common';

import { AppLogger } from '@config/logger/app-logger.config';
import { RoleRepository } from './role.repository';
import { Role } from '@entity/role.entity';
import { RoleEnum } from '@share/enum/role.enum';

@Injectable()
export class RoleService {
  constructor(
    private readonly repository: RoleRepository,
    private readonly log: AppLogger,
  ) {
    this.log.setContext(RoleService.name);
  }

  async fetchByUserId(userId: number): Promise<Role[]> {
    this.log.info(`Fetch roles by userId #${userId}`);
    return await this.repository.fetchByUserId(userId);
  }

  async fetchByNames(names: RoleEnum[]): Promise<Role[]> {
    this.log.info(`Fetch roles by names #${names}`);
    return await this.repository.fetchByNames(names);
  }
}
