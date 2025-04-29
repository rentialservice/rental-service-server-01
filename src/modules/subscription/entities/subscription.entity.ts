import { BaseEntity } from '../../../base/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('subscription')
export class Subscription extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  userId: string;

  @Column({ default: new Date() })
  startDate: Date;

  @Column({ default: new Date() })
  endDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
