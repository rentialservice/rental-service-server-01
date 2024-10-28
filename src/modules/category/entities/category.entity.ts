import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('category')
export class Category extends BaseEntity {
  @Column({ unique: true })
  categoryName: string;

  @Column({ default: "" })
  categoryDescription: string;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
