import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppLoggerModule } from '@config/logger/app-logger.module';
import { CategoryBloc } from '@module/category/category.bloc';
import { CategoryRepository } from '@module/category/category.repository';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from '@entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AppLoggerModule],
  providers: [CategoryBloc, CategoryService, CategoryRepository],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
