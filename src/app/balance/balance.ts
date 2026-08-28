import { AccountSchema } from '../account/account';
import { z } from 'zod';

export const BalanceSchema = z.object({
  owner: z.string(),
  equityAccount: AccountSchema,
  initialValue: z.number(),
  balance: z.number(),
});

export type Balance = z.infer<typeof BalanceSchema>;

export function balanceId(balance: Balance): string {
  return `owner=${balance.owner}&equityAccount=${balance.equityAccount.description}`;
}
