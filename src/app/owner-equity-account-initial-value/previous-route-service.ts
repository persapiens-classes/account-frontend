import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private readonly router: Router) {
    this.currentUrl = this.router.url;
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
