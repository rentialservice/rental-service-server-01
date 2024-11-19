import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Rental } from '../../rental/entities/rental.entity';
import { PaymentMode } from '../../payment-mode/entities/payment-mode.entity';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('payment_collection')
export class PaymentCollection extends BaseEntity {
  @Column({ default: '' })
  description: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @ManyToOne(() => Rental, (rental) => rental.paymentCollection)
  rental: Rental;

  @ManyToOne(() => Firm, (firm) => firm.paymentCollection)
  firm: Firm;

  @OneToOne(() => PaymentMode)
  @JoinColumn()
  paymentMode: PaymentMode;
}
