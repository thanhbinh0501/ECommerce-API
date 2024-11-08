import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@entity/product.entity';
import { ProductController } from './product.controller';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { ProductBloc } from './product.bloc';
import { ProductRepository } from './product.repository';
import { CategoryModule } from '@module/category/category.module';
import { CategoryRepository } from '@module/category/category.repository';
import { ColorModule } from '@module/color/color.module';
import { RomModule } from '@module/rom/rom.module';
import { VariantModule } from '@module/variant/variant.module';
import { ProductCategoryRepository } from '@module/product-category/product-category.repository';
import { ProductCategoryModule } from '@module/product-category/product-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    AppLoggerModule,
    CategoryModule,
    ColorModule,
    RomModule,
    forwardRef(() => VariantModule),
    ProductCategoryModule,
  ],
  providers: [ProductBloc, ProductService, ProductRepository, CategoryRepository, ProductCategoryRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}