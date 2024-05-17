import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableNotification1670208589839
  implements MigrationInterface
{
  name = 'CreateTableNotification1670208589839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notification\` (
        \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, 
        \`status\` tinyint NOT NULL DEFAULT '1', 
        \`type\` tinyint NULL, 
        \`title\` varchar(500) NULL, 
        \`url\` varchar(500) NULL, 
        \`redirect_id\` bigint UNSIGNED NULL, 
        \`redirect_type\` tinyint NULL, 
        \`target_type\` tinyint NOT NULL DEFAULT '1', 
        \`uuid\` varchar(255) NULL, 
        \`image\` varchar(255) NULL, 
        \`created_by\` bigint UNSIGNED NULL, 
        \`deleted_by\` bigint UNSIGNED NULL, 
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` bigint UNSIGNED NULL, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`CREATE TABLE \`notification_member\` (
      \`notification_id\` bigint UNSIGNED NOT NULL, 
      \`member_id\` bigint UNSIGNED NULL, 
      \`is_read\` tinyint NOT NULL DEFAULT '0', 
      \`status\` tinyint NOT NULL DEFAULT '1', 
      \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
      \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
      \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`notification_id\`)) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`notification_member\``);
    await queryRunner.query(`DROP TABLE \`notification\``);
  }
}
