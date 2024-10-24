import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@entity/category.entity';
import { CategoryController } from './category.controller';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { CategoryBloc } from './category.bloc';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AppLoggerModule],
  providers: [CategoryBloc, CategoryService, CategoryRepository],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
