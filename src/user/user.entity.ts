import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  private readonly logger = new Logger(User.name);

  @BeforeInsert()
  async beforeInsertActions() {
    this.logger.log(`beforeInsertActions acting...`);
    try {
      this.logger.log(`Generating uuid...`);
      this.uuid = uuidv4();
      this.logger.log(`Generated uuid: ${this.uuid}`);
    } catch (e: any) {
      this.logger.error(e.message);
      throw e;
    }
    try {
      this.logger.log(`Generating password hash...`);
      this.password = await bcrypt.hash(this.password, 10);
      this.logger.log(`Generated password hash: ${this.password}`);
    } catch (e: any) {
      this.logger.error(e.message);
      throw e;
    }
  }
}
