import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1731035837829 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
          new Table({
              name: 'products',
              columns: [
                  {
                      name: 'id',
                      type: 'bigint',
                      isPrimary: true,
                      isGenerated: true,
                      generationStrategy: 'increment',
                  },
                  {
                      name: 'name',
                      type: 'varchar',
                      length: '255',
                      isNullable: false,
                  },
                  {
                      name: 'description',
                      type: 'text',
                      isNullable: true,
                  },
                  {
                      name: 'createdBy',
                      type: 'bigint',
                      isNullable: false,
                  },
                  {
                      name: 'createdAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                  },
                  {
                      name: 'updatedBy',
                      type: 'bigint',
                      isNullable: true,
                  },
                  {
                      name: 'updatedAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                      onUpdate: 'CURRENT_TIMESTAMP(3)',
                      isNullable: true,
                  },
              ],
          }),
        );

        await queryRunner.createTable(
          new Table({
              name: 'product_category',
              columns: [
                  {
                      name: 'productId',
                      type: 'bigint',
                      isPrimary: true,
                  },
                  {
                      name: 'categoryId',
                      type: 'bigint',
                      isPrimary: true,
                  },
              ],
              foreignKeys: [
                  {
                      columnNames: ['productId'],
                      referencedTableName: 'products',
                      referencedColumnNames: ['id'],
                      onDelete: 'CASCADE',
                  },
                  {
                      columnNames: ['categoryId'],
                      referencedTableName: 'categories',
                      referencedColumnNames: ['id'],
                      onDelete: 'CASCADE',
                  },
              ],
          }),
        );

        await queryRunner.createTable(
          new Table({
              name: 'colors',
              columns: [
                  {
                      name: 'id',
                      type: 'bigint',
                      isPrimary: true,
                      isGenerated: true,
                      generationStrategy: 'increment',
                  },
                  {
                      name: 'name',
                      type: 'varchar',
                      length: '50',
                      isNullable: false,
                  },
                  {
                      name: 'code',
                      type: 'varchar',
                      length: '7',
                      isNullable: false,
                  },
                  {
                      name: 'createdBy',
                      type: 'bigint',
                      isNullable: false,
                  },
                  {
                      name: 'createdAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                  },
                  {
                      name: 'updatedBy',
                      type: 'bigint',
                      isNullable: true,
                  },
                  {
                      name: 'updatedAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                      onUpdate: 'CURRENT_TIMESTAMP(3)',
                      isNullable: true,
                  },
              ],
          }),
        );

        await queryRunner.createTable(
          new Table({
              name: 'roms',
              columns: [
                  {
                      name: 'id',
                      type: 'bigint',
                      isPrimary: true,
                      isGenerated: true,
                      generationStrategy: 'increment',
                  },
                  {
                      name: 'value',
                      type: 'int',
                      isNullable: false,
                  },
                  {
                      name: 'unit',
                      type: 'enum',
                      enum: ['GB', 'TB'],
                      isNullable: false,
                  },
                  {
                      name: 'createdBy',
                      type: 'bigint',
                      isNullable: false,
                  },
                  {
                      name: 'createdAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                  },
                  {
                      name: 'updatedBy',
                      type: 'bigint',
                      isNullable: true,
                  },
                  {
                      name: 'updatedAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                      onUpdate: 'CURRENT_TIMESTAMP(3)',
                      isNullable: true,
                  },
              ],
          }),
        );

        await queryRunner.createTable(
          new Table({
              name: 'variants',
              columns: [
                  {
                      name: 'id',
                      type: 'bigint',
                      isPrimary: true,
                      isGenerated: true,
                      generationStrategy: 'increment',
                  },
                  {
                      name: 'productId',
                      type: 'bigint',
                      isNullable: false,
                  },
                  {
                      name: 'colorId',
                      type: 'bigint',
                      isNullable: false,
                  },
                  {
                      name: 'romId',
                      type: 'bigint',
                      isNullable: false,
                  },
                  {
                      name: 'price',
                      type: 'decimal',
                      precision: 10,
                      scale: 2,
                      isNullable: false,
                  },
                  {
                      name: 'stock',
                      type: 'int',
                      isNullable: false,
                  },
                  {
                      name: 'createdBy',
                      type: 'bigint',
                      isNullable: false,
                  },
                  {
                      name: 'createdAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                  },
                  {
                      name: 'updatedBy',
                      type: 'bigint',
                      isNullable: true,
                  },
                  {
                      name: 'updatedAt',
                      type: 'timestamp(3)',
                      default: 'CURRENT_TIMESTAMP(3)',
                      onUpdate: 'CURRENT_TIMESTAMP(3)',
                      isNullable: true,
                  },
              ],
              foreignKeys: [
                  {
                      columnNames: ['productId'],
                      referencedTableName: 'products',
                      referencedColumnNames: ['id'],
                  },
                  {
                      columnNames: ['colorId'],
                      referencedTableName: 'colors',
                      referencedColumnNames: ['id'],
                  },
                  {
                      columnNames: ['romId'],
                      referencedTableName: 'roms',
                      referencedColumnNames: ['id'],
                  },
              ],
          }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('variants');
        await queryRunner.dropTable('roms');
        await queryRunner.dropTable('colors');
        await queryRunner.dropTable('product_category');
        await queryRunner.dropTable('products');
    }
}