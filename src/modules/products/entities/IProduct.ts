interface IProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  promotion_price: number;
  paused: boolean;
  tenant_id: string;
  category_id: string;
  image_id: string;
  created_at: Date;
  updated_at: Date;
}

export default IProduct;
