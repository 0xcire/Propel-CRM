import { z } from 'zod';
import { listingSchema } from '@/lib/validations/listings';

import type { BaseResponse } from '@/types';

export type Listing = {
  id: number;
  createdAt?: Date | null;
  address: string;
  userID: number | null;
  propertyType: string;
  price: string;
  bedrooms: number;
  baths: number;
  squareFeet: number;
  description: string;
  contacts?: Array<ContactInfo>;
};

export type NewListing = Omit<Listing, 'id' | 'createdAt'>;

export type Listings = Array<Listing>;

export interface ListingResponse extends BaseResponse {
  listings: Listings;
}

export type ListingFields = z.infer<typeof listingSchema>;

export type UpdateListingParams = {
  id: number;
  data: Partial<NewListing>;
};

export type ListingLeadParams = {
  listingID: number;
  contactID: number;
};

export type ListingContext = {
  previousListings: Listings | undefined;
};

export type ContactInfo = {
  id: number;
  name: string;
  phone: string;
  email: string;
};
