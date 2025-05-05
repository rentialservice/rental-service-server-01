import { Entity, Column, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Firm } from "../../firm/entities/firm.entity";
import { ModuleNameList } from "../../../enums/module.enum";

@Entity("prefix")
@Unique(["firm", "name"])
export class Prefix extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: "" })
  description: string;

  @Column({ type: "int", default: 1 })
  nextNumber: number;

  @ManyToOne(() => Firm, (firm) => firm.prefix)
  firm: Firm;

  @Column({ default: "" })
  module: string;
}
