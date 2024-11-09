import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('payment_mode')
export class PaymentMode extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => Firm, (firm) => firm.paymentMode)
  firm: Firm;
}
