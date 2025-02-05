import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Notification } from './notification.entity';
import { BaseEntity } from '../../../../base/base.entity';
import { Buyer } from '../../../users/buyer/entities/buyer.entity';

@Entity()
export class NotificationToken extends BaseEntity {
  @ManyToOne(() => Buyer, (user) => user.notificationTokens)
  user: Buyer;

  @Column()
  device_type: string;

  @Column()
  notification_token: string;

  @Column({
    default: 'ACTIVE',
  })
  status: string;

  @OneToMany(
    () => Notification,
    (notification) => notification.notification_token,
  )
  notifications: Notification[];
}
