import { Delete, Get, Patch, Post, handleAPIResponse } from '@/lib/fetch';
import type {
  ListingResponse,
  NewListing,
  UpdateListingParams,
} from '../types';

export const getDashboardListings = (): Promise<ListingResponse> => {
  return Get({ endpoint: 'dashboard/listings' }).then(
    handleAPIResponse<ListingResponse>
  );
};

export const getListings = (): Promise<ListingResponse> => {
  return Get({ endpoint: 'listings' }).then(handleAPIResponse<ListingResponse>);
};

export const createListing = (data: NewListing): Promise<ListingResponse> => {
  return Post({ endpoint: 'listings', body: JSON.stringify(data) }).then(
    handleAPIResponse<ListingResponse>
  );
};

export const updateListing = ({
  id,
  data,
}: UpdateListingParams): Promise<ListingResponse> => {
  return Patch({ endpoint: `listings/${id}`, body: JSON.stringify(data) }).then(
    handleAPIResponse<ListingResponse>
  );
};

export const deleteListing = (id: number): Promise<ListingResponse> => {
  return Delete({ endpoint: `listings/${id}` }).then(
    handleAPIResponse<ListingResponse>
  );
};
