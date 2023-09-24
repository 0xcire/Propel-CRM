declare namespace Express {
  interface Request {
    user: {
      id: number;
      username: string;
    };
    task: {};
    contact: {
      id?: number;
      name: string;
      email?: string;
      createdAt?: Date | null;
      phoneNumber?: string;
      address?: string;
    };
  }
}
