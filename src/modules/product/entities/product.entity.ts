import { Entity, Column, OneToMany, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { CustomFieldsData } from "../../custom-fields/entities/custom-fields-data.entity";
import { Status } from "../../../enums/status.enum";
// import { Category } from '../../category/entities/category.entity';
import { Firm } from "../../firm/entities/firm.entity";
import { RentalProduct } from "../../rental-products/entities/rental-product.entity";
import { Period } from "../../../enums/period.enum";

@Entity("product")
@Unique(["code", "firm"])
export class Product extends BaseEntity {
  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  code: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  salesPrice: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  fine: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ type: "text", default: "" })
  description: string;

  @Column({
    type: "enum",
    enum: Period,
    default: Period.PerDay,
  })
  rentalPeriod: string;

  @Column({
    type: "enum",
    enum: Period,
    default: Period.PerDay,
  })
  finePeriod: string;

  @Column({ type: "text", default: "" })
  color: string;

  @Column({ type: "text", default: "" })
  type: string;

  @Column({ type: "text", default: "" })
  barcode: string;

  @Column({ type: "text", default: "" })
  brand: string;

  @Column({ type: "text", default: "" })
  size: string;

  @Column({ type: "text", default: "" })
  unit: string;

  @Column({ type: "int", default: 0 })
  stock: number;

  @Column({ type: "int", default: 0 })
  currentRentedStock: number;

  @Column({ type: "simple-array", default: "" })
  keywords: string[];

  @Column({ type: "simple-array", default: "" })
  media: string[];

  @Column({
    type: "enum",
    enum: Status,
    default: Status.Available,
  })
  status: Status;

  @OneToMany(
    () => CustomFieldsData,
    (customFieldsData) => customFieldsData.product,
    { cascade: true },
  )
  customFieldsData: CustomFieldsData[];

  // @ManyToOne(() => Category, (category) => category.product)
  // category: Category;

  @ManyToOne(() => Firm, (firm) => firm.product)
  firm: Firm;

  @OneToMany(() => RentalProduct, (rentalProduct) => rentalProduct.product)
  rental: RentalProduct[];
}
