import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Branch } from '../../branches/entities/branch.entity';

@Entity()
export class Vehicle extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: String, unique: true })
  code: string;

  @Index()
  @Column({ type: String, unique: true })
  plate: string;

  @Column({ type: String })
  brand: string;

  @Column({ type: String })
  model: string;

  @ManyToOne(() => Branch, { eager: true, nullable: false })
  branch: Branch;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
