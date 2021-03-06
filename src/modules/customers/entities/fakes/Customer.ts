import ICustomer from '../ICustomer';

class Customer implements ICustomer {
  id: string;

  name: string;

  email: string;

  phone: string;

  social_security: string;

  created_at: Date;

  updated_at: Date;
}

export default Customer;
