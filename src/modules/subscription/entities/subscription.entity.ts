import { BaseEntity } from "../../../base/base.entity";
import { Entity, Column, OneToMany } from "typeorm";
import { SubscriptionDetails } from "./subscription-details.entity";

@Entity("subscription")
export class Subscription extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: "" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  basePrice: number;

  @Column({ type: "jsonb", nullable: true })
  features: Record<string, any>;

  @OneToMany(() => SubscriptionDetails, (details) => details.subscription)
  subscriptionDetails: SubscriptionDetails[];
}
