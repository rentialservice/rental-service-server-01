import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('boolean', { default: true })
  activeFlag: boolean;

  @Column('boolean', { default: false })
  deleteFlag: boolean;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column({ default: new Date() })
  modifiedAt: Date;
}
