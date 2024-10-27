import { BaseEntity } from '../../../base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('subscription')
export class Subscription extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}

