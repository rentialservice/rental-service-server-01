import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Product } from "../../product/entities/product.entity";
import { CustomFields } from "../../custom-fields/entities/custom-fields.entity";
import { Prefix } from "../../prefix/entities/prefix.entity";
import { PaymentMode } from "../../payment-mode/entities/payment-mode.entity";
import { TermsAndConditions } from "../../terms-and-conditions/entities/terms-and-conditions.entity";
import { Rental } from "../../rental/entities/rental.entity";
import { PaymentCollection } from "../../payment-collection/entities/payment-collection.entity";
import { SubscriptionDetails } from "../../subscription/entities/subscription-details.entity";

@Entity("firm")
export class Firm extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: "" })
  address: string;

  @Column({ default: "" })
  city: string;

  @Column({ default: "" })
  media: string;

  @Column({ default: "" })
  gstn: string;

  @Column({ default: "" })
  state: string;

  @Column({ default: "" })
  phone: string;

  @Column({ default: "" })
  email: string;

  @Column({ default: null })
  signature: string;

  @Column({ default: "" })
  description: string;

  // @ManyToMany(() => Category)
  // @JoinTable()
  // category: Category[];

  @OneToMany(() => Product, (product) => product.firm)
  product: Product[];

  @OneToMany(() => Prefix, (prefix) => prefix.firm)
  prefix: Prefix[];

  @OneToMany(() => PaymentMode, (paymentMode) => paymentMode.firm)
  paymentMode: PaymentMode[];

  @OneToMany(() => CustomFields, (customField) => customField.firm)
  customFields: CustomFields[];

  @OneToMany(
    () => TermsAndConditions,
    (termsAndConditions) => termsAndConditions.firm
  )
  termsAndConditions: TermsAndConditions[];

  @OneToMany(() => Rental, (rental) => rental.firm)
  rental: Rental[];

  @OneToMany(() => PaymentCollection, (rental) => rental.firm)
  paymentCollection: PaymentCollection[];

  @OneToMany(() => SubscriptionDetails, (rental) => rental.firm)
  subscription: SubscriptionDetails[];
}
