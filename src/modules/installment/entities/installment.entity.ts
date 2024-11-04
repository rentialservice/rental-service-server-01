import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('installment')
export class Installment extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;
}
