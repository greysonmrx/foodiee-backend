declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    customer: {
      id: string;
    };
  }
}
