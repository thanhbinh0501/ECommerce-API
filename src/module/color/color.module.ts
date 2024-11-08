import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from '@entity/color.entity';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { ColorController } from '@module/color/color.controller';
import { ColorService } from '@module/color/color.service';
import { ColorRepository } from '@module/color/color.repository';
import { ColorBloc } from '@module/color/color.bloc';

@Module({
  imports: [TypeOrmModule.forFeature([Color]), AppLoggerModule],
  providers: [ColorBloc, ColorService, ColorRepository],
  controllers: [ColorController],
  exports: [ColorService, ColorRepository],

})
export class ColorModule {}