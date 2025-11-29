import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
// provideAnimationsAsync used by primeng components that require animations
// eslint-disable-next-line sonarjs/deprecation
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authIntercept } from './auth/auth.interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    MessageService,
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // eslint-disable-next-line @typescript-eslint/no-deprecated, sonarjs/deprecation
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideHttpClient(withInterceptors([authIntercept])),
  ],
};
