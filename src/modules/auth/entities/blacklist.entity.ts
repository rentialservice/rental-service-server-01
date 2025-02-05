import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../base/base.entity';

@Entity()
export class Blacklist  extends BaseEntity {

  @Column({ default: '' })
  refreshToken: string;
}
