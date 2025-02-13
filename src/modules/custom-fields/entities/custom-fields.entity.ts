import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { CustomFieldsData } from './custom-fields-data.entity';
import { Firm } from '../../firm/entities/firm.entity';
import { ModuleNameList } from '../../../enums/module.enum';

@Entity('custom_fields')
export class CustomFields extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @Column('boolean', { default: false })
  required: boolean;

  @Column()
  fieldType: string;

  @Column({ type: 'enum', enum: ModuleNameList })
  module: string;

  @ManyToOne(() => Firm, (firm) => firm.customFields)
  firm: Firm;

  @Column('boolean', { default: false })
  isArray: boolean;

  @OneToMany(
    () => CustomFieldsData,
    (customFieldsData) => customFieldsData.product,
    { cascade: true },
  )
  customFieldsData: CustomFieldsData[];
}
