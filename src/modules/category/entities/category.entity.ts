import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Product } from '../../product/entities/product.entity';
import { Firm } from '../../firm/entities/firm.entity';

@Entity('category')
export class Category extends BaseEntity {
  @Column({ unique: true })
  categoryName: string;

  @Column({ default: "" })
  categoryDescription: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];

  @ManyToMany(() => Firm, (firm) => firm.categories)
  firms: Firm[];
}
