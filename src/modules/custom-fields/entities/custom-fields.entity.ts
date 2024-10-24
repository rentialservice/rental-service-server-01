import { Entity, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Module_Table } from '../../module/entities/module.entity';
import { CustomFieldsData } from './custom-fields-data.entity';

@Entity('custom_fields')
export class CustomFields extends BaseEntity {
  @Column({ unique: true })
  fieldName: string;

  @Column('boolean', { default: false })
  required: boolean;

  @Column()
  fieldType: string;

  @ManyToMany(() => Module_Table, (module) => module.customFields)
  @JoinTable()
  modules: Module_Table[];

  @Column('boolean', { default: false })
  isArray: boolean;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => CustomFieldsData, (customField) => customField.customField)
  @JoinColumn({ name: "CustomFieldId" })
  customFieldsData: CustomFieldsData;
}
