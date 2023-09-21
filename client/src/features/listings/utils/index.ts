import type { NewListing, ListingFields, Listing } from '../types';

export const transformData = (
  userID: number,
  values: ListingFields
): NewListing => {
  return {
    userID: userID,
    address: values.address,
    description: values.description,
    propertyType: values.propertyType,
    price: values.price,
    bedrooms: +values.bedrooms,
    baths: +values.baths,
    squareFeet: +values.squareFeet,
  };
};

export const generateDefaultValues = (
  listing: Listing | undefined
): ListingFields => {
  return {
    address: listing?.address ?? '',
    description: listing?.description ?? '',
    propertyType: listing?.propertyType ?? '',
    price: listing?.price ?? '',
    bedrooms: listing?.bedrooms.toString() ?? '',
    baths: listing?.baths.toString() ?? '',
    squareFeet: listing?.squareFeet.toString() ?? '',
  };
};
