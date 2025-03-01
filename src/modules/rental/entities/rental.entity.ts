import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Buyer } from '../../users/buyer/entities/buyer.entity';
import { PaymentMode } from '../../payment-mode/entities/payment-mode.entity';
import { Firm } from '../../firm/entities/firm.entity';
import { RentalPeriod } from '../../../enums/period.enum';
import { InvoiceStatus, Status } from '../../../enums/status.enum';
import { RentalProduct } from '../../rental-products/entities/rental-product.entity';

@Entity('rental')
export class Rental extends BaseEntity {
  @OneToMany(() => RentalProduct, (rentalProduct) => rentalProduct.rental, {
    onDelete: 'CASCADE',
  })
  rentalProduct: RentalProduct[];

  @ManyToOne(() => Buyer, (buyer) => buyer.rental)
  buyer: Buyer;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PartiallyPaid,
  })
  invoiceStatus: InvoiceStatus;

  @Column({ default: new Date() })
  invoiceDate: Date;

  @Column({ default: '' })
  invoicePrefix: string;

  @Column({ default: '' })
  invoiceId: string;

  @Column({ type: 'simple-array', default: '' })
  media: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advanceAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalFine: number;

  @Column({
    type: 'enum',
    enum: RentalPeriod,
    default: RentalPeriod.RentPerHour,
  })
  rentalPeriod: string;

  @ManyToOne(() => PaymentMode, (paymentMode) => paymentMode.rental)
  paymentMode: PaymentMode;

  @ManyToOne(() => Firm, (firm) => firm.rental)
  firm: Firm;

  // @OneToMany(
  //   () => PaymentCollection,
  //   (paymentCollection) => paymentCollection.rental,
  // )
  // paymentCollection: PaymentCollection[];
}
