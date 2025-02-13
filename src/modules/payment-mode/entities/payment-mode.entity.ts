import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Firm } from '../../firm/entities/firm.entity';
import { Rental } from '../../rental/entities/rental.entity';
import { PaymentCollection } from '../../payment-collection/entities/payment-collection.entity';

@Entity('payment_mode')
export class PaymentMode extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => Firm, (firm) => firm.paymentMode)
  firm: Firm;

  @OneToMany(() => Rental, (rental) => rental.paymentMode)
  rental: Rental[];

  @OneToMany(
    () => PaymentCollection,
    (paymentCollection) => paymentCollection.paymentMode,
  )
  paymentCollection: PaymentCollection[];
}
