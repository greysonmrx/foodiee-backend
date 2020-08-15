interface IComplementCategory {
  id: string;
  name: string;
  min: number;
  max: number;
  required: boolean;
  product_id: string;
  created_at: Date;
  updated_at: Date;
}

export default IComplementCategory;
