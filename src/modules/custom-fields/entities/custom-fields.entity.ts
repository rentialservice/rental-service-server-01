import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity()
export class CustomFields extends BaseEntity {
  @Column()
  fieldName: string;

  @Column('boolean', { default: false })
  required: boolean;

  @Column()
  fieldType: string;

  @Column('boolean', { default: false })
  isArray: boolean;

  @Column({ default: '' })
  description: string;
}
