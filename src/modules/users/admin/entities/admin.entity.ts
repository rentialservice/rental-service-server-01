import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../base/base.entity';
import { NotificationToken } from '../../../supporting-modules/notification/entities/notification-token.entity';
import { Role } from '../../../role/entities/role.entity';

@Entity('admin')
export class Admin extends BaseEntity {
  @Column({ default: '' })
  fullName: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  password: string;

  @Column('boolean', { default: false })
  isSuperAdmin: boolean;

  @Column({ default: '' })
  email: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({
    default:
      'https://res.cloudinary.com/twitter-clone-media/image/upload/v1597737557/user_wt3nrc.png',
  })
  avatar: string;

  @Column({
    default:
      'https://images.unsplash.com/photo-1462332420958-a05d1e002413?q=80&w=2107&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  })
  cover: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  dob: string;

  @Column({ default: 'offline' })
  status: string;

  @Column('boolean', { default: false })
  verified: boolean;

  @Column('boolean', { default: false })
  ssoLogin: boolean;

  @Column({ type: 'timestamptz', default: new Date() })
  lastSeen: Date;

  @OneToMany(
    () => NotificationToken,
    (notificationToken) => notificationToken.user,
  )
  notificationTokens: NotificationToken[];
}
