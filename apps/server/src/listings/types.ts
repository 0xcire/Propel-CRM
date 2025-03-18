import { Listing as _Listing } from "@propel/drizzle";
import type { ListingStatus } from "@propel/types";
import type { PaginationQuery } from "src/types";

export interface ListingSearchQuery extends PaginationQuery {
  address?: string;
  status: ListingStatus,
}

export type Listing = Omit<_Listing, 'userID'>

export type UpdatedListing = { id: number; address: string; propertyType: string; price: string; bedrooms: number; baths: number; squareFeet: number; description: string; }
