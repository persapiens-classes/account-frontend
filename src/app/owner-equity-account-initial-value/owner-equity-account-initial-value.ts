import { AccountSchema, createAccount } from '../account/account';
import { z } from 'zod';

export const OwnerEquityAccountInitialValueSchema = z.object({
  owner: z.string(),
  equityAccount: AccountSchema,
  initialValue: z.number(),
});

export type OwnerEquityAccountInitialValue = z.infer<typeof OwnerEquityAccountInitialValueSchema>;

export function ownerEquityAccountInitialValueId(
  ownerEquityAccountInitialValue: OwnerEquityAccountInitialValue,
): string {
  return `owner=${ownerEquityAccountInitialValue.owner}&equityAccount=${ownerEquityAccountInitialValue.equityAccount.description}`;
}

export interface OwnerEquityAccountInitialValueInsert {
  owner: string;
  equityAccount: string;
  initialValue: number;
}

export function createOwnerEquityAccountInitialValue(): OwnerEquityAccountInitialValue {
  return {
    owner: '',
    equityAccount: createAccount(),
    initialValue: 0,
  };
}
