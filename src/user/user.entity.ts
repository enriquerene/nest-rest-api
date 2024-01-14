import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
