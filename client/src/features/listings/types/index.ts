import { BaseResponse } from '@/types';
import { ListingHTMLFormInputs } from '../components/ListingForm';

export type Listing = {
  id: number;
  createdAt: Date | null;
  address: string;
  userID: number | null;
  propertyType: string;
  price: string;
  bedrooms: number;
  baths: number;
  squareFeet: number;
  description: string;
};

export type NewListing = Omit<Listing, 'id' | 'createdAt'>;

export type Listings = Array<Listing>;

export interface ListingResponse extends BaseResponse {
  listings: Listings;
}

export type UpdateListingParams = {
  id: number;
  data: Partial<ListingHTMLFormInputs>;
};
