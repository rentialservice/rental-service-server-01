import { BaseEntity } from '../../../base/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Status } from '../../../enums/status.enum';
import { Rental } from '../../rental/entities/rental.entity';
import { Period } from '../../../enums/period.enum';

@Entity('rental_product')
export class RentalProduct extends BaseEntity {
  @ManyToOne(() => Rental, (rental) => rental.rentalProduct, { cascade: true })
  rental: Rental;

  @ManyToOne(() => Product, (product) => product.rental)
  product: Product;

  @Column({ default: new Date() })
  startDate: Date;

  @Column({ default: new Date() })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Rented,
  })
  status: Status;

  @Column({ type: 'simple-array', default: '' })
  media: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salesPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fine: number;

  @Column({ type: 'text', default: '' })
  unit: string;

  @Column({
    type: 'enum',
    enum: Period,
    default: Period.PerDay,
  })
  finePeriod: string;

  @Column({
    type: 'enum',
    enum: Period,
    default: Period.PerHour,
  })
  rentalPeriod: string;
}
