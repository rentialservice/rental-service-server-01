import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Permission } from "../../permission/entities/permission.entity";
@Entity("role")
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: "" })
  description: string;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];
}
