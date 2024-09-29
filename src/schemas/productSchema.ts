import { z } from 'zod';

export const productSchema = z.object({
  serialNumber: z.string(),
  productName: z.string(),
  category: z.coerce.number(),  
  price: z.coerce.number().positive(),  
  description: z.string(),
  brand: z.string(),
  model: z.string(),
  conditional: z.enum(['new', 'used']),
  yearOfManufacture: z.coerce.number().gte(1900).lte(new Date().getFullYear()),  
  usageDuration: z.coerce.number().min(0),  
  title: z.string(),
  weight: z.coerce.number(),  
  height: z.coerce.number(),  
  city: z.string(),
  postalCode: z.string(),
  specificAddress: z.string(),
  currency: z.enum(['USD', 'VND']),
});
