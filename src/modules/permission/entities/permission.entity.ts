import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity('permission')
export class Permission extends BaseEntity{
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;
}
