import { z } from 'zod';
import { priceString } from './schema';

export const listingSchema = z.object({
  address: z.string().min(1).max(500),
  description: z.string().min(1, { message: 'required' }),
  propertyType: z.string().min(1).max(50),
  price: priceString,
  bedrooms: z.string().trim(),
  baths: z.string().trim(),
  squareFeet: z.string().min(1, { message: 'ex.) 2500' }).trim(),
});
