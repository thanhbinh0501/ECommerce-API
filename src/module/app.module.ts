import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { OrmConfig } from '@database/data-source';
import { AuthModule } from './auth/auth.module';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { CategoryModule } from './category/category.module';
import { AppController } from '@module/app.controller';
import { ProductModule } from './product/product.module';
import { ColorModule } from './color/color.module';

// @ts-ignore
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        const testDataSourceOptionsString = process.env.TEST_DATA_SOURCE_OPTIONS;
        let testDataSourceOptions = {};
        if (testDataSourceOptionsString) {
          testDataSourceOptions = JSON.parse(testDataSourceOptionsString);
        }
        return {
          ...OrmConfig,
          ...testDataSourceOptions,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const existingDataSource = getDataSourceByName(options.name || 'default');
        return existingDataSource || addTransactionalDataSource(new DataSource(options));
      },
    }),
    AuthModule,
    UserModule,
    AppLoggerModule,
    CategoryModule,
    ProductModule,
    ColorModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
