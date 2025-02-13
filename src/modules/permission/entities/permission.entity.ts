import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('permission')
export class Permission extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => Role, (role) => role.permissions)
  role: Role;
}
