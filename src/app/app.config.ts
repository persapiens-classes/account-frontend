import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authIntercept } from './auth/auth.interceptor';
import { CategoryService, CREDIT_CATEGORY_SERVICE, DEBIT_CATEGORY_SERVICE, EQUITY_CATEGORY_SERVICE } from './category/category-service';
import { AccountService, CREDIT_ACCOUNT_SERVICE, DEBIT_ACCOUNT_SERVICE, EQUITY_ACCOUNT_SERVICE } from './account/account-service';
import { CREDIT_ENTRY_SERVICE, DEBIT_ENTRY_SERVICE, EntryService, TRANSFER_ENTRY_SERVICE } from './entry/entry-service';
import { OWNER_SERVICE, OwnerService } from './owner/owner-service';
import { OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_SERVICE, OwnerEquityAccountInitialValueService } from './owner-equity-account-initial-value/owner-equity-account-initial-value-service';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [MessageService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura, options: { darkModeSelector: '.app-dark' }
      }
    }),
    provideHttpClient(
      withInterceptors([authIntercept])
    ),
    {
      provide: CREDIT_CATEGORY_SERVICE,
      useFactory: (http: HttpClient) => new CategoryService(http, 'Credit'),
      deps: [HttpClient]
    },
    {
      provide: DEBIT_CATEGORY_SERVICE,
      useFactory: (http: HttpClient) => new CategoryService(http, 'Debit'),
      deps: [HttpClient]
    },
    {
      provide: EQUITY_CATEGORY_SERVICE,
      useFactory: (http: HttpClient) => new CategoryService(http, 'Equity'),
      deps: [HttpClient]
    },
    {
      provide: CREDIT_ACCOUNT_SERVICE,
      useFactory: (http: HttpClient) => new AccountService(http, 'Credit'),
      deps: [HttpClient]
    },
    {
      provide: DEBIT_ACCOUNT_SERVICE,
      useFactory: (http: HttpClient) => new AccountService(http, 'Debit'),
      deps: [HttpClient]
    },
    {
      provide: EQUITY_ACCOUNT_SERVICE,
      useFactory: (http: HttpClient) => new AccountService(http, 'Equity'),
      deps: [HttpClient]
    },
    {
      provide: CREDIT_ENTRY_SERVICE,
      useFactory: (http: HttpClient) => new EntryService(http, 'Credit'),
      deps: [HttpClient]
    },
    {
      provide: DEBIT_ENTRY_SERVICE,
      useFactory: (http: HttpClient) => new EntryService(http, 'Debit'),
      deps: [HttpClient]
    },
    {
      provide: TRANSFER_ENTRY_SERVICE,
      useFactory: (http: HttpClient) => new EntryService(http, 'Transfer'),
      deps: [HttpClient]
    },
    {
      provide: OWNER_SERVICE,
      useFactory: (http: HttpClient) => new OwnerService(http),
      deps: [HttpClient]
    },
    {
      provide: OWNER_EQUITY_ACCOUNT_INITIAL_VALUE_SERVICE,
      useFactory: (http: HttpClient) => new OwnerEquityAccountInitialValueService(http),
      deps: [HttpClient]
    },
  ]
};
