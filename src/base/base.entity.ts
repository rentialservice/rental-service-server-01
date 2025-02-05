import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('boolean', { default: true })
  activeFlag: boolean;

  @Column('boolean', { default: false })
  deleteFlag: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}

// similar to above (only for reference)

// @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
// createdAt: Date;

// @Column({ type: 'timestamp', onUpdate: 'CURRENT_TIMESTAMP' })
// updatedAt: Date;
