import { Delete, Get, Patch, Post, handleAPIResponse } from '@/lib/fetch';
import type { ListingResponse, UpdateListingParams } from '../types';
import { ListingHTMLFormInputs } from '../components/ListingForm';

export const getListings = (): Promise<ListingResponse> => {
  return Get({ endpoint: 'listings' }).then(handleAPIResponse<ListingResponse>);
};

export const createListing = (
  data: ListingHTMLFormInputs
): Promise<ListingResponse> => {
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
