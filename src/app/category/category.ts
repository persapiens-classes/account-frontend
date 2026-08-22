import { z } from 'zod';

export const CategorySchema = z.object({
  description: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

export function categoryId(category: Category): string {
  return category.description;
}

export function createCategory(): Category {
  return { description: '' };
}

export enum CategoryType {
  CREDIT = 'Credit',
  DEBIT = 'Debit',
  EQUITY = 'Equity',
}
