import { Router } from '@angular/router';
import { AppMessageService } from '../app-message-service';
import { inject, Service } from '@angular/core';

@Service()
export class NavigateService {
  router = inject(Router);
  appMessageService = inject(AppMessageService);

  navigate(path: string): void {
    this.router.navigate([path]).catch((navigationError) => {
      this.appMessageService.addErrorMessage(
        navigationError,
        'Navigation Error',
        `Failed to navigate to ${path}. Please try again.`,
      );
    });
  }
}
