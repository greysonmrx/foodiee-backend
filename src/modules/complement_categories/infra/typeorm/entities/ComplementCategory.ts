import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import IComplementCategory from '@modules/complement_categories/entities/IComplementCategory';

@Entity('complement_categories')
class ComplementCategory implements IComplementCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  min: number;

  @Column()
  max: number;

  @Column()
  name: string;

  @Column()
  required: boolean;

  @Column()
  product_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default ComplementCategory;
