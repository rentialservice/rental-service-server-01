import { BaseEntity } from "../../../base/base.entity";
import { Entity, Column, ManyToOne } from "typeorm";
import { Subscription } from "./subscription.entity";
import { Firm } from "../../firm/entities/firm.entity";

@Entity("subscription_details")
export class SubscriptionDetails extends BaseEntity {
  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.subscriptionDetails
  )
  subscription: Subscription;

  @ManyToOne(() => Firm, (firm) => firm.subscriptionDetails)
  firm: Firm;

  @Column({ default: new Date() })
  startDate: Date;

  @Column({ default: new Date() })
  endDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  isActive: boolean;
}
