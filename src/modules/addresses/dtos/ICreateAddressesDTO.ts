interface ICreateAddressesDTO {
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
}

export default ICreateAddressesDTO;
