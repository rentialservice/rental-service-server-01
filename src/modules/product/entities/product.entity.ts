import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { CustomFieldsData } from '../../custom-fields/entities/custom-fields-data.entity';
import { ProductStatus } from '../../../enums/status.enum';

@Entity('product')
export class Product extends BaseEntity {
  @Column({ unique: true })
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

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.Draft,
  })
  productStatus: ProductStatus;

  @Column()
  productCode: string;

  @OneToMany(() => CustomFieldsData, (customFieldsData) => customFieldsData.product, { cascade: true })
  customFieldsData: CustomFieldsData[];
}

