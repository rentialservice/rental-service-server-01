import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { Notification } from './notification.entity';
import { BaseEntity } from '../../../../base/base.entity';

@Entity()
export class NotificationToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notificationTokens)
  user: User;

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
