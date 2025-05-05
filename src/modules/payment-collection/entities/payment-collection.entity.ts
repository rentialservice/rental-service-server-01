import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { PaymentMode } from "../../payment-mode/entities/payment-mode.entity";
import { Firm } from "../../firm/entities/firm.entity";
import { Buyer } from "../../users/buyer/entities/buyer.entity";

@Entity("payment_collection")
export class PaymentCollection extends BaseEntity {
  @Column({ default: "" })
  description: string;

  @Column({ default: new Date() })
  receiptDate: Date;

  @Column({ default: "" })
  receiptPrefix: string;

  @Column({ default: "" })
  receiptId: string;

  @Column("jsonb", { default: () => "'[]'" })
  rental: any[];

  @ManyToOne(() => Firm, (firm) => firm.paymentCollection)
  firm: Firm;

  @ManyToOne(() => PaymentMode, (paymentMode) => paymentMode.paymentCollection)
  paymentMode: PaymentMode;

  @ManyToOne(() => Buyer, (buyer) => buyer.rental)
  buyer: Buyer;
}
