interface ICreateProductsDTO {
  name: string;
  price: number;
  description: string;
  category_id: string;
  tenant_id: string;
  promotion_price?: number;
  paused?: boolean;
  image_id?: string;
}

export default ICreateProductsDTO;
