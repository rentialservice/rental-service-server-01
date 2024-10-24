import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity('category')
export class Category extends BaseEntity {
  @Column({ unique: true })
  categoryName: string;

  @Column({ default: "" })
  categoryDescription: string;
}
