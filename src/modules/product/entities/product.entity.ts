import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

interface CustomFieldsData {
  customFieldId: string,
  value: string
}

@Entity('product')
export class Product extends BaseEntity {
  @Column()
  productName: string;

  @Column('decimal')
  price: number;

  @Column('decimal')
  salesPrice: number;

  @Column({ type: 'text' })
  description: string;

  @Column('int')
  stock: number;

  @Column('simple-array')
  keywords: string[];

  @Column()
  productStatus: string;

  @Column()
  productCode: string;

  @Column('json')
  customFieldsData: CustomFieldsData[];
}

