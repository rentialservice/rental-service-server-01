import { Entity, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { Seller } from '../../users/seller/entities/seller.entity';

@Entity('firm')
export class Firm extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => Subscription)
  subscription: Subscription;
}