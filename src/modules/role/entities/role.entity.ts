import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Permission } from '../../permission/entities/permission.entity';

@Entity('role')
export class Role extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => Permission, (permission) => permission.id)
  @JoinColumn({ name: "permissionId" })
  permissionIds: Permission[];

}
