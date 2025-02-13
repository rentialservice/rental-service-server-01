import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { CustomFields } from './custom-fields.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('custom_fields_data')
export class CustomFieldsData extends BaseEntity {
  @ManyToOne(
    () => CustomFields,
    (customField) => customField.customFieldsData,
    { onDelete: 'CASCADE' },
  )
  customField: CustomFields;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.customFieldsData, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
