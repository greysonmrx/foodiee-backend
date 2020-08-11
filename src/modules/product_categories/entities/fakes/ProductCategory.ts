import IProductCategory from '../IProductCategory';

class ProductCategory implements IProductCategory {
  id: string;

  name: string;

  tenant_id: string;

  created_at: Date;

  updated_at: Date;
}

export default ProductCategory;
