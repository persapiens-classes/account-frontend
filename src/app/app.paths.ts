export const PATHS = {
  LOGIN_PATH: 'login',
  ACCOUNT_PATH: 'Accounts',
  OWNER_PATH: 'owners',
  CATEGORY_PATH: 'Categories',
  ENTRY_PATH: 'Entries',
  BALANCE_PATH: 'balances',
  OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_PATH: 'ownerEquityAccountInitialValues',
};

export function loginPath(): string {
  return `/${PATHS.LOGIN_PATH}`;
}

export function listPath(path: string): string {
  return `/${path}/list`;
}

export function newPath(path: string): string {
  return `/${path}/new`;
}

export function editPath(path: string): string {
  return `/${path}/edit`;
}

export function detailPath(path: string): string {
  return `/${path}/detail`;
}
