import { BaseEntity } from '../../../../base/base.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { NotificationToken } from '../../../supporting-modules/notification/entities/notification-token.entity';
import { Firm } from '../../../firm/entities/firm.entity';
import { Role } from '../../../role/entities/role.entity';
import { Rental } from '../../../rental/entities/rental.entity';

@Entity("buyer")
export class Buyer extends BaseEntity {
  @Column({ default: '' })
  fullName: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  alternatePhone: string;

  @Column({ default: '' })
  adhaarNo: string;

  @Column({ default: '' })
  drivingLicense: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: '' })
  email: string;

  @ManyToOne(() => Firm)
  firm: Firm;

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

  @OneToMany(() => NotificationToken, (notificationToken) => notificationToken.user)
  notificationTokens: NotificationToken[];

  @OneToMany(() => Rental, (rental) => rental.buyer)
  rental: Rental[];
}
