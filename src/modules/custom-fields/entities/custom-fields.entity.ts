import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Module_Table } from '../../module/entities/module.entity';
import { CustomFieldsData } from './custom-fields-data.entity';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('custom_fields')
export class CustomFields extends BaseEntity {
  @Column()
  fieldName: string;

  @Column('boolean', { default: false })
  required: boolean;

  @Column()
  fieldType: string;

  @ManyToOne(() => Module_Table, (module) => module.customFields)
  module: Module_Table;

  @ManyToOne(() => Firm, (firm) => firm.customFields)
  firm: Firm;

  @Column('boolean', { default: false })
  isArray: boolean;

  @Column({ default: '' })
  description: string;

  @OneToMany(() => CustomFieldsData, (customFieldsData) => customFieldsData.product, { cascade: true })
  customFieldsData: CustomFieldsData[];
}