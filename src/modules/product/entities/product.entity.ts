import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { CustomFieldsData } from '../../custom-fields/entities/custom-fields-data.entity';
import { ProductStatus, RentalPeriod } from '../../../enums/status.enum';
import { Category } from '../../category/entities/category.entity';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('product')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salesPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fine: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ default: '' })
  description: string;

  @Column({
    type: 'enum',
    enum: RentalPeriod,
    default: RentalPeriod.RentPerHour,
  })
  rentalPeriod: string;

  @Column({ default: '' })
  color: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  currentRentedStock: number;

  @Column({ type: 'simple-array', default: "" })
  keywords: string[];

  @Column({ type: 'simple-array', default: "" })
  media: string[];

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.Available,
  })
  status: ProductStatus;

  @Column()
  code: string;

  @OneToMany(() => CustomFieldsData, (customFieldsData) => customFieldsData.product, { cascade: true })
  customFieldsData: CustomFieldsData[];

  @ManyToOne(() => Category, (category) => category.product)
  category: Category;

  @ManyToOne(() => Firm, (firm) => firm.product)
  firm: Firm;
}

