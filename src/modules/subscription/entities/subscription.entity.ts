import { BaseEntity } from '../../../base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('subscription')
export class Subscription extends BaseEntity {
  @Con({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  validity: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
