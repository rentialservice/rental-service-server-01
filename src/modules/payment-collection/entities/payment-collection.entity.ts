import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity('payment_collection')
export class PaymentCollection extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  description: string;
}
