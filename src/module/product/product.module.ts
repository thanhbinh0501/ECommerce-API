import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@entity/product.entity';
import { ProductController } from './product.controller';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { ProductBloc } from './product.bloc';
import { ProductRepository } from './product.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AppLoggerModule],
  providers: [ProductBloc, ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}