import ICustomerToken from '../ICustomerToken';

class CustomerToken implements ICustomerToken {
  id: string;

  token: string;

  customer_id: string;

  created_at: Date;

  updated_at: Date;
}

export default CustomerToken;
