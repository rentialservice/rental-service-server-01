import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity('module_table')
export class Module_Table extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;
}
