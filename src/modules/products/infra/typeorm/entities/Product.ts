import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Tenant from '../../../../tenants/infra/typeorm/entities/Tenant';
import Category from '../../../../product_categories/infra/typeorm/entities/ProductCategory';
import File from '../../../../files/infra/typeorm/entities/File';

import IProduct from '../../../entities/IProduct';

@Entity('products')
class Product implements IProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  paused: boolean;

  @Column()
  promotion_price: number;

  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  image_id: string;

  @OneToOne(() => File)
  @JoinColumn({ name: 'image_id' })
  image: File;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
