import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { VariantRepository } from './variant.repository';
import { Variant } from '@entity/variant.entity';
import { VariantBloc } from '@module/variant/variant.bloc';
import { VariantService } from '@module/variant/variant.service';
import { VariantController } from '@module/variant/variant.controller';
import { ColorModule } from '@module/color/color.module';
import { RomModule } from '@module/rom/rom.module';
import { ProductModule } from '@module/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variant]),
    AppLoggerModule,
    forwardRef(() => ColorModule),
    RomModule,
    forwardRef(() => ProductModule),
  ],
  providers: [VariantBloc, VariantService, VariantRepository],
  controllers: [VariantController],
  exports: [VariantService, VariantRepository],
})
export class VariantModule {}