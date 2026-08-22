import { z } from 'zod';

export const OwnerSchema = z.object({
  name: z.string(),
});

export type Owner = z.infer<typeof OwnerSchema>;

export function ownerId(owner: Owner): string {
  return owner.name;
}

export function createOwner(): Owner {
  return {
    name: '',
  };
}
