import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { CustomFieldsData } from '../../custom-fields/entities/custom-fields-data.entity';
import { ProductStatus } from '../../../enums/status.enum';
import { Category } from '../../category/entities/category.entity';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column()
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salesPrice: number;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'simple-array', default: [] })
  keywords: string[];

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.Draft,
  })
  productStatus: ProductStatus;

  @Column({ unique: true, default: '' })
  productCode: string;

  @OneToMany(() => CustomFieldsData, (customFieldsData) => customFieldsData.product, { cascade: true })
  customFieldsData: CustomFieldsData[];

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @ManyToOne(() => Firm, (firm) => firm.product)
  firm: Firm;
}

