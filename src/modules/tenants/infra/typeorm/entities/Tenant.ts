import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import File from '../../../../files/infra/typeorm/entities/File';

@Entity('tenants')
class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  logo_id: string;

  @OneToOne(() => File)
  @JoinColumn({ name: 'logo_id' })
  logo: File;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Tenant;
