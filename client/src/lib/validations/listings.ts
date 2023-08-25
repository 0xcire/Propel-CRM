import { z } from 'zod';
import { priceString } from './schema';

// TODO: address validation. string for now
// backend service that calls geocoding api and do something based on result
// apply to contacts as well

export const listingSchema = z
  .object({
    address: z.string().min(1).max(500),
    description: z.string().min(1).max(500),
    propertyType: z.string().min(1).max(50),
    price: priceString,
    bedrooms: z.string(),
    baths: z.string(),
    squareFeet: z.string(),
    // bedrooms: z.number().nonnegative().finite(),
    // baths: z.number().positive().finite(),
    // squareFeet: z.number().positive().finite(),
  })
  .transform((schema) => ({
    address: schema.address,
    description: schema.description,
    propertyType: schema.propertyType,
    price: schema.price,
    bedrooms: +schema.bedrooms,
    baths: +schema.baths,
    squareFeet: +schema.squareFeet,
  }));
