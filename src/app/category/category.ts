export interface Category {
  description: string;
}

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
