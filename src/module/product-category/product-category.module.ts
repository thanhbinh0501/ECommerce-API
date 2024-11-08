import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryRepository } from './product-category.repository';
import { ProductCategory } from '@entity/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [ProductCategoryRepository],
  exports: [TypeOrmModule],
})
export class ProductCategoryModule {}