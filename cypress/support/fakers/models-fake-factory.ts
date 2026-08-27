import { Factory } from 'fishery';
import { faker } from '@faker-js/faker/locale/pt_BR'; // Dados em Português
import { Account } from '../../../src/app/account/account';
import { Owner } from '../../../src/app/owner/owner';
import { Category } from '../../../src/app/category/category';
import { Entry } from '../../../src/app/entry/entry';
import { Balance } from '../../../src/app/owner-equity-account-initial-value/balance';

export const ownerFactory = Factory.define<Owner>(() => ({
  name: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
}));

export const categoryFactory = Factory.define<Category>(() => ({
  description: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
}));

export const accountFactory = Factory.define<Account>(() => ({
  description: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
  category: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
}));

export const entryFactory = Factory.define<Entry>(() => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  inOwner: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
  outOwner: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
  date: faker.date.recent({ days: 30 }),
  inAccount: accountFactory.build(),
  outAccount: accountFactory.build(),
  value: faker.number.int({ min: 0, max: 10000 }),
  note: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
}));

export const balanceFactory = Factory.define<Balance>(() => ({
  owner: faker.string.alpha({ length: { min: 3, max: 2555 }, casing: 'upper' }),
  equityAccount: accountFactory.build(),
  initialValue: faker.number.int({ min: 0, max: 10000 }),
  balance: faker.number.int({ min: 0, max: 10000 }),
}));
