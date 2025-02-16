import { BaseEntity } from '../../../base/base.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Status } from '../../../enums/status.enum';
import { Rental } from '../../rental/entities/rental.entity';

@Entity('rentalProduct')
export class RentalProduct extends BaseEntity {
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

  @ManyToOne(() => Rental, (rental) => rental.rentalProduct)
  rental: Rental;
}
