import { BaseEntity } from "../../../../base/base.entity";
import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { NotificationToken } from "../../../supporting-modules/notification/entities/notification-token.entity";
import { Firm } from "../../../firm/entities/firm.entity";
import { Rental } from "../../../rental/entities/rental.entity";
import { PaymentCollection } from "../../../payment-collection/entities/payment-collection.entity";

@Entity("buyer")
export class Buyer extends BaseEntity {
  @Column({ default: "" })
  fullName: string;

  @Column({ default: "" })
  username: string;

  @Column({ default: "" })
  phone: string;

  @Column({ default: "" })
  address: string;

  @Column({ type: "simple-array", default: "" })
  documents: string[];

  @Column({ default: "" })
  city: string;

  @Column({ default: "" })
  state: string;

  @Column({ default: "" })
  pincode: string;

  @Column({ default: "" })
  alternatePhone: string;

  @Column({ default: "" })
  adhaarNo: string;

  @Column({ default: "" })
  drivingLicense: string;

  @Column({ default: "" })
  password: string;

  @Column({ default: "" })
  email: string;

  @ManyToOne(() => Firm)
  firm: Firm;

  @OneToMany(
    () => NotificationToken,
    (notificationToken) => notificationToken.user,
  )
  notificationTokens: NotificationToken[];

  @OneToMany(() => Rental, (rental) => rental.buyer)
  rental: Rental[];

  @OneToMany(
    () => PaymentCollection,
    (paymentCollection) => paymentCollection.buyer,
  )
  paymentCollection: PaymentCollection[];
}
