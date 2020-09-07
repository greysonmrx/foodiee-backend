interface IAddress {
  id: string;
  customer_id: string;
  name?: string;
  street: string;
  number?: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
  latitude: number;
  longitude: number;
  created_at: Date;
  updated_at: Date;
}

export default IAddress;
