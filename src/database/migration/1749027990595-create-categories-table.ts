import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoriesTable1749027990595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'int unsigned',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'createdBy',
            type: 'int unsigned',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime(3)',
            default: 'CURRENT_TIMESTAMP(3)',
            isNullable: false,
          },
          {
            name: 'updatedBy',
            type: 'int unsigned',
            isNullable: true,
          },
          {
            name: 'updatedAt',
            type: 'datetime(3)',
            onUpdate: 'CURRENT_TIMESTAMP(3)',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categories');
  }
}
