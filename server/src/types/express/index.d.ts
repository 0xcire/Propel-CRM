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
    task: {
      id: number;
      createdAt: Date | null;
      description: string | null;
      userID: number;
      contactID?: number | null;
      listingID?: number | null;
      title: string;
      notes: string | null;
      dueDate: string | null;
      completed: boolean | null;
      priority: "low" | "medium" | "high" | null;
      status: "todo" | "in progress" | "done" | "canceled" | null;
    };
  }
}

// can't import type and set ??
// {
//   ...
//   listing: Listing,
//   contact: Contact,
//   task: Task
// }
