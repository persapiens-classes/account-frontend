import { Bean } from '../bean/bean';

export class Category implements Bean {
  constructor(public description: string) {}

  getId(): string {
    return this.description;
  }
}

export function createCategory(): Category {
  return new Category('');
}
