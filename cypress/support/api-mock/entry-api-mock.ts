/// <reference types="cypress" />

import { ModelCrudApiMock, validate } from './model-crud-api-mock';
import { AccountType } from '../../../src/app/account/account';
import { accountsDefault, entriesDefault } from '../fakers/models-default';
import { Entry, EntryInsertUpdate, EntryType } from '../../../src/app/entry/entry';
import { entryApiPath } from '../../e2e/entry/entry-helpers';

export function entryApiMock(
  type: EntryType,
): ModelCrudApiMock<EntryInsertUpdate, EntryInsertUpdate, Entry, string> {
  const entriesEndpoint = `/${entryApiPath(type)}`;

  const idFn = (model: Entry): string => model.id.toString();

  const validateFn = (entry: EntryInsertUpdate | undefined): string | null => {
    let result = validate('In Account description', entry?.inAccount);

    if (!result) {
      result = validate('Out Account description', entry?.outAccount);
    }
    if (!result) {
      result = validate('In Owner', entry?.inOwner);
    }
    if (!result) {
      result = validate('Out Owner', entry?.outOwner);
    }

    return result;
  };

  const entries = entriesDefault(type);
  const creditAccounts = accountsDefault(AccountType.CREDIT);
  const debitAccounts = accountsDefault(AccountType.DEBIT);
  const equityAccounts = accountsDefault(AccountType.EQUITY);

  const insertToModelFn = (insertModel: EntryInsertUpdate): Entry => {
    const inAccount =
      debitAccounts.find((a) => a.description === insertModel.inAccount) ||
      equityAccounts.find((a) => a.description === insertModel.inAccount);

    const outAccount =
      creditAccounts.find((a) => a.description === insertModel.outAccount) ||
      equityAccounts.find((a) => a.description === insertModel.outAccount);

    return {
      id: entries.length + 1, // Assign a new ID based on the current length of entries
      date: insertModel.date,
      value: insertModel.value,
      note: insertModel.note,
      inAccount: inAccount!,
      outAccount: outAccount!,
      inOwner: insertModel.inOwner,
      outOwner: insertModel.outOwner,
    };
  };

  const updateToModelFn = (updateModel: EntryInsertUpdate, id?: string): Entry => {
    const inAccount =
      debitAccounts.find((a) => a.description === updateModel.inAccount) ||
      equityAccounts.find((a) => a.description === updateModel.inAccount);

    const outAccount =
      creditAccounts.find((a) => a.description === updateModel.outAccount) ||
      equityAccounts.find((a) => a.description === updateModel.outAccount);

    return {
      id: id ? Number.parseInt(id) : 0,
      date: updateModel.date,
      value: updateModel.value,
      note: updateModel.note,
      inAccount: inAccount!,
      outAccount: outAccount!,
      inOwner: updateModel.inOwner,
      outOwner: updateModel.outOwner,
    };
  };

  const equalsFn = (model1: Entry, model2: Entry): boolean => {
    return (
      model1.id === model2.id &&
      model1.note === model2.note &&
      model1.value === model2.value &&
      model1.date.getTime() === model2.date.getTime() &&
      model1.inAccount.description === model2.inAccount.description &&
      model1.outAccount.description === model2.outAccount.description &&
      model1.inOwner === model2.inOwner &&
      model1.outOwner === model2.outOwner
    );
  };

  return new ModelCrudApiMock<EntryInsertUpdate, EntryInsertUpdate, Entry, string>({
    endpoint: entriesEndpoint,
    idFn: idFn,
    models: entries,
    postValidateFn: validateFn,
    putValidateFn: validateFn,
    insertToModelFn: insertToModelFn,
    updateToModelFn: updateToModelFn,
    equalsFn: equalsFn,
  });
}
