import { BaseEntity } from '../../../../base/base.entity';
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { ROLES } from '../../../../enums/role.enum';
import { NotificationToken } from '../../../supporting-modules/notification/entities/notification-token.entity';
import { Firm } from '../../../firm/entities/firm.entity';

@Entity()
export class Buyer extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  password: string;

  @Column()
  email: string;

  @OneToOne(() => Firm)
  @JoinColumn({ name: 'firmId' })
  firm: Firm;

  @Column({ type: 'enum', enum: ROLES, default: ROLES.USER })
  role: ROLES;

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

  @OneToMany(() => NotificationToken, (notificationToken) => notificationToken.user)
  notificationTokens: NotificationToken[];
}
