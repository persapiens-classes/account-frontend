import { inject, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor() {
    const router = inject(Router);
    this.currentUrl = router.url;
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  public getPreviousUrl(): string | null {
    return this.previousUrl;
  }
}
