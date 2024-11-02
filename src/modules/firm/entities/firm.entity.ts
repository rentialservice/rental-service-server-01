import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { Category } from '../../category/entities/category.entity';
import { Product } from '../../product/entities/product.entity';
@Entity('firm')
export class Firm extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  description: string;

  @ManyToOne(() => Subscription)
  subscription: Subscription;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}