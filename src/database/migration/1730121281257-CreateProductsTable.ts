import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsTable1730121281257 implements MigrationInterface {

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
                name: 'price',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: false,
              },
              {
                name: 'quantity',
                type: 'int',
                isNullable: false,
              },
              {
                name: 'color',
                type: 'varchar',
                length: '100',
                isNullable: true,
              },
              {
                name: 'rom',
                type: 'int',
                isNullable: true,
                comment: 'Dung lượng bộ nhớ ROM (GB)',
              },
              {
                name: 'ram',
                type: 'int',
                isNullable: true,
                comment: 'Dung lượng RAM (GB)',
              },
              {
                name: 'categoryId',
                type: 'bigint',
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
                columnNames: ['categoryId'],
                referencedTableName: 'categories',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
              },
            ],
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('products');
      }
    }