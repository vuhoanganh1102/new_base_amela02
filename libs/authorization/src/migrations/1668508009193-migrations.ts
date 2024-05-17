import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1668508009193 implements MigrationInterface {
  name = 'migrations1668508009193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permission_group\` (
        \`id\` int NOT NULL AUTO_INCREMENT, 
        \`name\` varchar(150) NOT NULL, 
        UNIQUE INDEX \`IDX_032c209da98ae7c1a915b51c27\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permission\` (
        \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, 
        \`name\` varchar(255) NOT NULL, 
        \`permission_group_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role_permission\` (
        \`role_id\` int UNSIGNED NOT NULL, 
        \`permission_id\` int UNSIGNED NOT NULL, PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (
        \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, 
        \`name\` varchar(255) NOT NULL, 
        \`is_system\` tinyint NOT NULL COMMENT '1: is a system, 0: not system' DEFAULT '0', 
        \`is_visible\` tinyint NOT NULL DEFAULT '1', 
        UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_permission\` (
        \`user_id\` bigint UNSIGNED NOT NULL, 
        \`permission_id\` int NOT NULL, PRIMARY KEY (\`user_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permission\` ADD CONSTRAINT \`FK_0248d0e8d737351620b03c3cfca\` FOREIGN KEY (\`permission_group_id\`) REFERENCES \`permission_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_3d0a7155eafd75ddba5a7013368\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` ADD CONSTRAINT \`FK_e3a3ba47b7ca00fd23be4ebd6cf\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_e3a3ba47b7ca00fd23be4ebd6cf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role_permission\` DROP FOREIGN KEY \`FK_3d0a7155eafd75ddba5a7013368\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_0248d0e8d737351620b03c3cfca\``,
    );
    await queryRunner.query(`DROP TABLE \`user_permission\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``,
    );
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`role_permission\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_032c209da98ae7c1a915b51c27\` ON \`permission_group\``,
    );
    await queryRunner.query(`DROP TABLE \`permission_group\``);
  }
}
