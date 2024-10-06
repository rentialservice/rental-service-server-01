import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  categoryName: string;

  @Column({ default: "" })
  categoryDescription: string;
}
