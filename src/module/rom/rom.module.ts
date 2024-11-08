import { Module } from '@nestjs/common';
import { RomService } from './rom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rom } from '@entity/rom.entity';
import { RomController } from './rom.controller';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { RomBloc } from './rom.bloc';
import { RomRepository } from './rom.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Rom]), AppLoggerModule],
  providers: [RomBloc, RomService, RomRepository],
  controllers: [RomController],
  exports: [RomService, RomRepository],
})
export class RomModule {}