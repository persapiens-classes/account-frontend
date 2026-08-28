import { Factory } from 'fishery';
import { faker } from '@faker-js/faker/locale/pt_BR'; // Dados em Português
import { Account, AccountType } from '../../../src/app/account/account';
import { Owner } from '../../../src/app/owner/owner';
import { Category, CategoryType } from '../../../src/app/category/category';
import { Entry } from '../../../src/app/entry/entry';
import { Balance } from '../../../src/app/balance/balance';
import { OwnerEquityAccountInitialValue } from '../../../src/app/balance/owner-equity-account-initial-value';

export const ownerFactory = Factory.define<Owner>(() => ({
  name: faker.person.firstName(),
}));

class CategoryFactory extends Factory<Category> {
  withType(type: CategoryType) {
    return this.params({
      description: `${type} - ${faker.string.alpha({ length: { min: 3, max: 9 }, casing: 'upper' })}`,
    });
  }
}

export const categoryFactory = CategoryFactory.define(() => ({
  description: faker.string.alpha({ length: { min: 3, max: 10 }, casing: 'upper' }),
}));

class AccountFactory extends Factory<Account> {
  withTypeAndCategory(type: AccountType, category: Category) {
    return this.params({
      description: `${type} - ${faker.string.alpha({ length: { min: 3, max: 12 }, casing: 'upper' })}`,
      category: category.description,
    });
  }
}

export const accountFactory = AccountFactory.define(() => ({
  description: faker.string.alpha({ length: { min: 3, max: 12 }, casing: 'upper' }),
  category: categoryFactory.build().description,
}));

export const entryFactory = Factory.define<Entry>(() => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  inOwner: ownerFactory.build().name,
  outOwner: ownerFactory.build().name,
  date: faker.date.recent({ days: 30 }),
  inAccount: accountFactory.build(),
  outAccount: accountFactory.build(),
  value: faker.number.int({ min: 0, max: 10000 }),
  note: faker.string.alpha({ length: { min: 3, max: 15 }, casing: 'upper' }),
}));

export const balanceFactory = Factory.define<Balance>(() => ({
  owner: ownerFactory.build().name,
  equityAccount: accountFactory
    .withTypeAndCategory(AccountType.EQUITY, categoryFactory.withType(CategoryType.EQUITY).build())
    .build(),
  initialValue: faker.number.int({ min: 0, max: 10000 }),
  balance: faker.number.int({ min: 0, max: 10000 }),
}));

export const ownerEquityAccountInitialValueFactory = Factory.define<OwnerEquityAccountInitialValue>(
  () => ({
    owner: ownerFactory.build().name,
    equityAccount: accountFactory
      .withTypeAndCategory(
        AccountType.EQUITY,
        categoryFactory.withType(CategoryType.EQUITY).build(),
      )
      .build(),
    initialValue: faker.number.int({ min: 0, max: 999 }),
    balance: faker.number.int({ min: 0, max: 999 }),
  }),
);
