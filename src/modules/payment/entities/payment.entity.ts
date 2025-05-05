import { Entity, Column, Index } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";

export enum PaymentStatus {
  CREATED = "created",
  AUTHORIZED = "authorized",
  CAPTURED = "captured",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export enum RefundStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}

@Entity("payment")
export class Payment extends BaseEntity {
  @Column({ default: "razorpay" })
  provider_name: string;

  @Index()
  @Column({ nullable: true })
  subscription_id: string;

  @Index()
  @Column()
  user_id: string;

  @Index()
  @Column({ unique: true })
  order_id: string;

  @Index()
  @Column({ unique: true, nullable: true })
  payment_id: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ default: "INR" })
  currency: string;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.CREATED })
  status: PaymentStatus;

  @Column({ nullable: true })
  refund_id: string;

  @Column({ type: "enum", enum: RefundStatus, nullable: true })
  refund_status: RefundStatus;

  @Column({ nullable: true })
  receipt: string;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  webhook_signature: string;

  @Column({ type: "timestamp", nullable: true })
  captured_at: Date;

  @Column({ type: "timestamp", nullable: true })
  refunded_at: Date;
}
