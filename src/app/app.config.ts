import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authIntercept } from './auth/auth.interceptor';
import {
  CategoryInsertService,
  CREDIT_CATEGORY_INSERT_SERVICE,
  DEBIT_CATEGORY_INSERT_SERVICE,
  EQUITY_CATEGORY_INSERT_SERVICE,
} from './category/category-insert-service';
import {
  AccountUpdateService,
  CREDIT_ACCOUNT_UPDATE_SERVICE,
  DEBIT_ACCOUNT_UPDATE_SERVICE,
  EQUITY_ACCOUNT_UPDATE_SERVICE,
} from './account/account-update-service';
import {
  CREDIT_ENTRY_UPDATE_SERVICE,
  DEBIT_ENTRY_UPDATE_SERVICE,
  EntryUpdateService,
  TRANSFER_ENTRY_UPDATE_SERVICE,
} from './entry/entry-update-service';
import { OWNER_INSERT_SERVICE, OwnerInsertService } from './owner/owner-insert-service';
import {
  OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_INSERT_SERVICE,
  OwnerEquityAccountInitialValueInsertService,
} from './owner-equity-account-initial-value/owner-equity-account-initial-value-insert-service';
import { MessageService } from 'primeng/api';
import {
  BALANCE_LIST_SERVICE,
  BalanceListService,
} from './owner-equity-account-initial-value/balance-list-service';
import {
  CategoryDetailService,
  CREDIT_CATEGORY_DETAIL_SERVICE,
  DEBIT_CATEGORY_DETAIL_SERVICE,
  EQUITY_CATEGORY_DETAIL_SERVICE,
} from './category/category-detail-service';
import {
  CategoryListService,
  CREDIT_CATEGORY_LIST_SERVICE,
  DEBIT_CATEGORY_LIST_SERVICE,
  EQUITY_CATEGORY_LIST_SERVICE,
} from './category/category-list-service';
import {
  CategoryRemoveService,
  CREDIT_CATEGORY_REMOVE_SERVICE,
  DEBIT_CATEGORY_REMOVE_SERVICE,
  EQUITY_CATEGORY_REMOVE_SERVICE,
} from './category/category-remove-service';
import {
  CategoryUpdateService,
  CREDIT_CATEGORY_UPDATE_SERVICE,
  DEBIT_CATEGORY_UPDATE_SERVICE,
  EQUITY_CATEGORY_UPDATE_SERVICE,
} from './category/category-update-service';
import {
  AccountInsertService,
  CREDIT_ACCOUNT_INSERT_SERVICE,
  DEBIT_ACCOUNT_INSERT_SERVICE,
  EQUITY_ACCOUNT_INSERT_SERVICE,
} from './account/account-insert-service';
import {
  CREDIT_ENTRY_INSERT_SERVICE,
  DEBIT_ENTRY_INSERT_SERVICE,
  EntryInsertService,
  TRANSFER_ENTRY_INSERT_SERVICE,
} from './entry/entry-insert-service';
import {
  AccountDetailService,
  CREDIT_ACCOUNT_DETAIL_SERVICE,
  DEBIT_ACCOUNT_DETAIL_SERVICE,
  EQUITY_ACCOUNT_DETAIL_SERVICE,
} from './account/account-detail-service';
import {
  CREDIT_ENTRY_DETAIL_SERVICE,
  DEBIT_ENTRY_DETAIL_SERVICE,
  EntryDetailService,
  TRANSFER_ENTRY_DETAIL_SERVICE,
} from './entry/entry-detail-service';
import { OWNER_DETAIL_SERVICE, OwnerDetailService } from './owner/owner-detail-service';
import {
  AccountListService,
  CREDIT_ACCOUNT_LIST_SERVICE,
  DEBIT_ACCOUNT_LIST_SERVICE,
  EQUITY_ACCOUNT_LIST_SERVICE,
} from './account/account-list-service';
import {
  CREDIT_ENTRY_LIST_SERVICE,
  DEBIT_ENTRY_LIST_SERVICE,
  EntryListService,
  TRANSFER_ENTRY_LIST_SERVICE,
} from './entry/entry-list-service';
import { OWNER_LIST_SERVICE, OwnerListService } from './owner/owner-list-service';
import {
  AccountRemoveService,
  CREDIT_ACCOUNT_REMOVE_SERVICE,
  DEBIT_ACCOUNT_REMOVE_SERVICE,
  EQUITY_ACCOUNT_REMOVE_SERVICE,
} from './account/account-remove-service';
import {
  CREDIT_ENTRY_REMOVE_SERVICE,
  DEBIT_ENTRY_REMOVE_SERVICE,
  EntryRemoveService,
  TRANSFER_ENTRY_REMOVE_SERVICE,
} from './entry/entry-remove-service';
import { OWNER_REMOVE_SERVICE, OwnerRemoveService } from './owner/owner-remove-service';
import { OWNER_UPDATE_SERVICE, OwnerUpdateService } from './owner/owner-update-service';
import {
  BALANCE_DETAIL_SERVICE,
  BalanceDetailService,
} from './owner-equity-account-initial-value/balance-detail-service';
import {
  OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_UPDATE_SERVICE,
  OwnerEquityAccountInitialValueUpdateService,
} from './owner-equity-account-initial-value/owner-equity-account-initial-value-update-service';
import {
  OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_REMOVE_SERVICE,
  OwnerEquityAccountInitialValueRemoveService,
} from './owner-equity-account-initial-value/owner-equity-account-initial-value-remove-service';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
    provideHttpClient(withInterceptors([authIntercept])),
    {
      provide: CREDIT_CATEGORY_DETAIL_SERVICE,
      useFactory: () => new CategoryDetailService('Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_CATEGORY_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new CategoryInsertService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_CATEGORY_LIST_SERVICE,
      useFactory: (http: HttpClient) => new CategoryListService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_CATEGORY_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new CategoryRemoveService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_CATEGORY_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new CategoryUpdateService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_CATEGORY_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new CategoryInsertService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_CATEGORY_DETAIL_SERVICE,
      useFactory: () => new CategoryDetailService('Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_CATEGORY_LIST_SERVICE,
      useFactory: (http: HttpClient) => new CategoryListService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_CATEGORY_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new CategoryRemoveService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_CATEGORY_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new CategoryUpdateService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_CATEGORY_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new CategoryInsertService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_CATEGORY_DETAIL_SERVICE,
      useFactory: () => new CategoryDetailService('Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_CATEGORY_LIST_SERVICE,
      useFactory: (http: HttpClient) => new CategoryListService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_CATEGORY_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new CategoryRemoveService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_CATEGORY_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new CategoryUpdateService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ACCOUNT_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new AccountInsertService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ACCOUNT_DETAIL_SERVICE,
      useFactory: () => new AccountDetailService('Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ACCOUNT_LIST_SERVICE,
      useFactory: (http: HttpClient) => new AccountListService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ACCOUNT_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new AccountRemoveService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ACCOUNT_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new AccountUpdateService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ACCOUNT_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new AccountInsertService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ACCOUNT_DETAIL_SERVICE,
      useFactory: () => new AccountDetailService('Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ACCOUNT_LIST_SERVICE,
      useFactory: (http: HttpClient) => new AccountListService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ACCOUNT_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new AccountRemoveService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ACCOUNT_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new AccountUpdateService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_ACCOUNT_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new AccountInsertService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_ACCOUNT_DETAIL_SERVICE,
      useFactory: () => new AccountDetailService('Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_ACCOUNT_LIST_SERVICE,
      useFactory: (http: HttpClient) => new AccountListService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_ACCOUNT_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new AccountRemoveService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: EQUITY_ACCOUNT_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new AccountUpdateService(http, 'Equity'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ENTRY_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new EntryInsertService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ENTRY_DETAIL_SERVICE,
      useFactory: () => new EntryDetailService('Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ENTRY_LIST_SERVICE,
      useFactory: (http: HttpClient) => new EntryListService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ENTRY_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new EntryRemoveService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: CREDIT_ENTRY_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new EntryUpdateService(http, 'Credit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ENTRY_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new EntryInsertService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ENTRY_DETAIL_SERVICE,
      useFactory: () => new EntryDetailService('Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ENTRY_LIST_SERVICE,
      useFactory: (http: HttpClient) => new EntryListService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ENTRY_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new EntryRemoveService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: DEBIT_ENTRY_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new EntryUpdateService(http, 'Debit'),
      deps: [HttpClient],
    },
    {
      provide: TRANSFER_ENTRY_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new EntryInsertService(http, 'Transfer'),
      deps: [HttpClient],
    },
    {
      provide: TRANSFER_ENTRY_DETAIL_SERVICE,
      useFactory: () => new EntryDetailService('Transfer'),
      deps: [HttpClient],
    },
    {
      provide: TRANSFER_ENTRY_LIST_SERVICE,
      useFactory: (http: HttpClient) => new EntryListService(http, 'Transfer'),
      deps: [HttpClient],
    },
    {
      provide: TRANSFER_ENTRY_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new EntryRemoveService(http, 'Transfer'),
      deps: [HttpClient],
    },
    {
      provide: TRANSFER_ENTRY_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new EntryUpdateService(http, 'Transfer'),
      deps: [HttpClient],
    },
    {
      provide: OWNER_INSERT_SERVICE,
      useFactory: () => new OwnerInsertService(),
      deps: [HttpClient],
    },
    {
      provide: OWNER_DETAIL_SERVICE,
      useFactory: () => new OwnerDetailService(),
      deps: [HttpClient],
    },
    {
      provide: OWNER_LIST_SERVICE,
      useFactory: () => new OwnerListService(),
      deps: [HttpClient],
    },
    {
      provide: OWNER_REMOVE_SERVICE,
      useFactory: () => new OwnerRemoveService(),
      deps: [HttpClient],
    },
    {
      provide: OWNER_UPDATE_SERVICE,
      useFactory: () => new OwnerUpdateService(),
      deps: [HttpClient],
    },
    {
      provide: BALANCE_DETAIL_SERVICE,
      useFactory: () => new BalanceDetailService(),
      deps: [HttpClient],
    },
    {
      provide: BALANCE_LIST_SERVICE,
      useFactory: (http: HttpClient) => new BalanceListService(http),
      deps: [HttpClient],
    },
    {
      provide: OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_INSERT_SERVICE,
      useFactory: (http: HttpClient) => new OwnerEquityAccountInitialValueInsertService(http),
      deps: [HttpClient],
    },
    {
      provide: OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_REMOVE_SERVICE,
      useFactory: (http: HttpClient) => new OwnerEquityAccountInitialValueRemoveService(http),
      deps: [HttpClient],
    },
    {
      provide: OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_UPDATE_SERVICE,
      useFactory: (http: HttpClient) => new OwnerEquityAccountInitialValueUpdateService(http),
      deps: [HttpClient],
    },
  ],
};
