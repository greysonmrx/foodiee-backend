import IComplement from '../IComplement';

class Complement implements IComplement {
  id: string;

  name: string;

  price: number;

  category_id: string;

  created_at: Date;

  updated_at: Date;
}

export default Complement;
