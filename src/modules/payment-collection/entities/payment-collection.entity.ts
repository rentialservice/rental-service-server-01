import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Rental } from '../../rental/entities/rental.entity';
import { PaymentMode } from '../../payment-mode/entities/payment-mode.entity';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('payment_collection')
export class PaymentCollection extends BaseEntity {
  @Column({ default: '' })
  description: string;

  @Column({ default: new Date() })
  receiptDate: Date;

  @Column({ default: '' })
  receiptPrefix: string;

  @Column({ default: '' })
  receiptId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @ManyToOne(() => Rental, (rental) => rental.paymentCollection)
  rental: Rental;

  @ManyToOne(() => Firm, (firm) => firm.paymentCollection)
  firm: Firm;

  @ManyToOne(() => PaymentMode, (paymentMode) => paymentMode.paymentCollection)
  paymentMode: PaymentMode;
}
