declare namespace Express {
  interface Request {
    user: {
      id: number;
      username: string;
    };
    task: {};
    listing: {
      id: number;
      createdAt: Date | null;
      description: string;
      userID: number | null;
      address: string;
      propertyType: string;
      price: string;
      bedrooms: number;
      baths: number;
      squareFeet: number;
    };
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

// can't import type and set ??
// {
//   ...
//   listing: Listing,
//   contact: Contact
// }
