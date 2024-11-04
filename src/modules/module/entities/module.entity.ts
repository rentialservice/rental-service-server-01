import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { CustomFields } from '../../custom-fields/entities/custom-fields.entity';

@Entity('module_table')
export class Module_Table extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => CustomFields, (customField) => customField.module)
  customFields: CustomFields[];
}
