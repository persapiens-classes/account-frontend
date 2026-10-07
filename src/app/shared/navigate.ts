import { Router } from '@angular/router';
import { AppMessageService } from '../app-message-service';

export function navigateTo(
  router: Router,
  appMessageService: AppMessageService,
  path: string,
): void {
  router.navigate([path]).catch((navigationError) => {
    appMessageService.addErrorMessage(
      navigationError,
      'Navigation Error',
      `Failed to navigate to ${path}. Please try again.`,
    );
  });
}
