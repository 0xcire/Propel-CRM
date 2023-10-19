import { z } from 'zod';
import { priceString } from './schema';

export const listingSchema = z.object({
  address: z.string().min(1).max(500),
  description: z.string().min(1).max(500),
  propertyType: z.string().min(1).max(50),
  price: priceString,
  bedrooms: z.string().trim(),
  baths: z.string().trim(),
  squareFeet: z.string().trim(),
});
