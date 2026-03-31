import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class Branch extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: String, unique: true })
  code: string;

  @Column({ type: String })
  address: string;

  @Index()
  @Column({ type: String })
  city: string;

  @Column({ type: String })
  zip: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
