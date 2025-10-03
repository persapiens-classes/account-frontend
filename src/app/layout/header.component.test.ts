import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';

import { HeaderComponent } from './header.component';
import { AuthService } from '../auth/auth.service';
import { TestUtils } from '../shared/test-utils';

// Mock AuthService
const mockAuthService = {
  authenticatedLogin: vi.fn(),
  logout: vi.fn(),
};

// Mock Router
const mockRouter = {
  navigate: vi.fn(),
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestUtils.setupComponentTestBed(HeaderComponent, [
      { provide: AuthService, useValue: mockAuthService },
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, HeaderComponent);
      expect(component).toBeTruthy();
    });

    it('should inject AuthService and Router dependencies', () => {
      expect(authService).toBeDefined();
      expect(router).toBeDefined();
      expect(authService).toBe(mockAuthService);
      expect(router).toBe(mockRouter);
    });

    it('should have access to authService methods', () => {
      expect(component.authenticatedLogin).toBeDefined();
      expect(component.logout).toBeDefined();
      expect(typeof component.authenticatedLogin).toBe('function');
      expect(typeof component.logout).toBe('function');
    });
  });

  describe('Template Rendering', () => {
    it('should render header container with correct classes', () => {
      fixture.detectChanges();

      const headerContainer = fixture.nativeElement.querySelector(
        'div.flex.items-center.gap-2\\.5.mb-3',
      );
      expect(headerContainer).toBeTruthy();
    });

    it('should render account logo with correct attributes', () => {
      fixture.detectChanges();

      const logo = fixture.nativeElement.querySelector('img');
      expect(logo).toBeTruthy();
      expect(logo.getAttribute('src')).toBe('images/account.png');
      expect(logo.getAttribute('alt')).toBe('Account logo');
      expect(logo.classList.contains('w-[70px]')).toBe(true);
      expect(logo.classList.contains('h-auto')).toBe(true);
      expect(logo.classList.contains('self-center')).toBe(true);
    });

    it('should render application title', () => {
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h1');
      expect(title).toBeTruthy();
      expect(title.textContent.trim()).toBe('Account');
      expect(title.classList.contains('font-serif')).toBe(true);
      expect(title.classList.contains('italic')).toBe(true);
      expect(title.classList.contains('text-3xl')).toBe(true);
    });

    it('should render user login span with correct layout', () => {
      mockAuthService.authenticatedLogin.mockReturnValue('testuser');
      fixture.detectChanges();

      const userSpan = fixture.nativeElement.querySelector('span.ml-auto');
      expect(userSpan).toBeTruthy();
      expect(userSpan.textContent.trim()).toBe('testuser');
    });

    it('should render logout button with correct attributes', () => {
      fixture.detectChanges();

      const logoutButton = fixture.nativeElement.querySelector('p-button');
      expect(logoutButton).toBeTruthy();
      expect(logoutButton.getAttribute('pTooltip')).toBe('Logout');
      expect(logoutButton.getAttribute('icon')).toBe('pi pi-sign-out');
      expect(logoutButton.getAttribute('severity')).toBe('danger');
    });
  });

  describe('Authentication Integration', () => {
    it('should call authService.authenticatedLogin and display result', () => {
      const mockUsername = 'john.doe';
      mockAuthService.authenticatedLogin.mockReturnValue(mockUsername);

      const result = component.authenticatedLogin();
      fixture.detectChanges();

      expect(authService.authenticatedLogin).toHaveBeenCalled();
      expect(result).toBe(mockUsername);

      const userSpan = fixture.nativeElement.querySelector('span.ml-auto');
      expect(userSpan.textContent.trim()).toBe(mockUsername);
    });

    it('should handle empty username from authService', () => {
      mockAuthService.authenticatedLogin.mockReturnValue('');

      const result = component.authenticatedLogin();
      fixture.detectChanges();

      expect(authService.authenticatedLogin).toHaveBeenCalled();
      expect(result).toBe('');

      const userSpan = fixture.nativeElement.querySelector('span.ml-auto');
      expect(userSpan.textContent.trim()).toBe('');
    });

    it('should handle null username from authService', () => {
      mockAuthService.authenticatedLogin.mockReturnValue(null);

      const result = component.authenticatedLogin();
      fixture.detectChanges();

      expect(authService.authenticatedLogin).toHaveBeenCalled();
      expect(result).toBe(null);
    });

    it('should call authenticatedLogin multiple times and return consistent results', () => {
      const mockUsername = 'test.user';
      mockAuthService.authenticatedLogin.mockReturnValue(mockUsername);

      const result1 = component.authenticatedLogin();
      const result2 = component.authenticatedLogin();

      expect(authService.authenticatedLogin).toHaveBeenCalledTimes(2);
      expect(result1).toBe(mockUsername);
      expect(result2).toBe(mockUsername);
    });
  });

  describe('Logout Functionality', () => {
    it('should call authService.logout when logout method is called', () => {
      component.logout();

      expect(authService.logout).toHaveBeenCalledOnce();
      expect(authService.logout).toHaveBeenCalledWith();
    });

    it('should navigate to login page after logout', () => {
      component.logout();

      expect(router.navigate).toHaveBeenCalledOnce();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should call logout and navigate in correct order', () => {
      const logoutSpy = vi.spyOn(authService, 'logout');
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.logout();

      expect(logoutSpy).toHaveBeenCalledBefore(navigateSpy);
      expect(authService.logout).toHaveBeenCalledOnce();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
  });

  describe('User Interaction', () => {
    it('should trigger logout when logout button is clicked', () => {
      // Spy on component methods before triggering events
      const logoutSpy = vi.spyOn(component, 'logout');

      fixture.detectChanges();

      const logoutButton = fixture.debugElement.query(By.css('p-button'));
      expect(logoutButton).toBeTruthy();

      // Trigger the click event
      logoutButton.triggerEventHandler('click', new Event('click'));

      // Verify the component method was called
      expect(logoutSpy).toHaveBeenCalled();
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });

    it('should handle rapid logout button clicks gracefully', () => {
      fixture.detectChanges();

      const logoutButton = fixture.debugElement.query(By.css('p-button'));

      // Simulate rapid clicks
      logoutButton.triggerEventHandler('click', new Event('click'));
      logoutButton.triggerEventHandler('click', new Event('click'));
      logoutButton.triggerEventHandler('click', new Event('click'));

      // Multiple calls should not cause errors
      expect(authService.logout).toHaveBeenCalledTimes(3);
      expect(router.navigate).toHaveBeenCalledTimes(3);
    });
  });

  describe('Component Layout', () => {
    it('should have correct flexbox layout structure', () => {
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('div');
      expect(container.classList.contains('flex')).toBe(true);
      expect(container.classList.contains('items-center')).toBe(true);
      expect(container.classList.contains('gap-2.5')).toBe(true);
      expect(container.classList.contains('mb-3')).toBe(true);
    });

    it('should position user span with ml-auto class', () => {
      fixture.detectChanges();

      const userSpan = fixture.nativeElement.querySelector('span');
      expect(userSpan.classList.contains('ml-auto')).toBe(true);
    });

    it('should render all elements in correct order', () => {
      mockAuthService.authenticatedLogin.mockReturnValue('testuser');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('div');
      const children = container.children;

      expect(children[0].tagName).toBe('IMG'); // Logo
      expect(children[1].tagName).toBe('H1'); // Title
      expect(children[2].tagName).toBe('SPAN'); // User span
      expect(children[3].tagName).toBe('P-BUTTON'); // Logout button
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive alt text for logo', () => {
      fixture.detectChanges();

      const logo = fixture.nativeElement.querySelector('img');
      expect(logo.getAttribute('alt')).toBe('Account logo');
    });

    it('should have tooltip for logout button', () => {
      fixture.detectChanges();

      const logoutButton = fixture.nativeElement.querySelector('p-button');
      expect(logoutButton.getAttribute('pTooltip')).toBe('Logout');
    });

    it('should use semantic HTML elements', () => {
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector('h1');
      const image = fixture.nativeElement.querySelector('img');

      expect(title).toBeTruthy();
      expect(image).toBeTruthy();
    });

    it('should have meaningful button icon', () => {
      fixture.detectChanges();

      const logoutButton = fixture.nativeElement.querySelector('p-button');
      const icon = logoutButton.getAttribute('icon');
      expect(icon).toBe('pi pi-sign-out');
      expect(icon).toContain('sign-out');
    });
  });

  describe('Error Handling', () => {
    it('should handle authService errors gracefully', () => {
      mockAuthService.authenticatedLogin.mockImplementation(() => {
        throw new Error('Auth service error');
      });

      expect(() => component.authenticatedLogin()).toThrow('Auth service error');

      // Reset the mock after the test
      mockAuthService.authenticatedLogin.mockReset();
    });

    it('should handle router navigation errors', () => {
      mockRouter.navigate.mockImplementation(() => {
        throw new Error('Navigation error');
      });

      expect(() => component.logout()).toThrow('Navigation error');

      // Reset the mock after the test
      mockRouter.navigate.mockReset();
    });

    it('should handle logout service errors', () => {
      mockAuthService.logout.mockImplementation(() => {
        throw new Error('Logout error');
      });

      expect(() => component.logout()).toThrow('Logout error');

      // Reset the mock after the test
      mockAuthService.logout.mockReset();
    });
  });

  describe('Component Integration', () => {
    it('should work with different authentication states', () => {
      // Test authenticated state
      mockAuthService.authenticatedLogin.mockReturnValue('authenticated.user');
      let result = component.authenticatedLogin();
      expect(result).toBe('authenticated.user');

      // Test unauthenticated state
      mockAuthService.authenticatedLogin.mockReturnValue('');
      result = component.authenticatedLogin();
      expect(result).toBe('');

      // Test null state
      mockAuthService.authenticatedLogin.mockReturnValue(null);
      result = component.authenticatedLogin();
      expect(result).toBe(null);
    });

    it('should maintain proper service communication flow', () => {
      // Ensure mocks are clean and working before testing
      mockAuthService.logout.mockReset();
      mockRouter.navigate.mockReset();

      // Setup spies to track call order
      const authLoginSpy = vi.spyOn(authService, 'authenticatedLogin');
      const authLogoutSpy = vi.spyOn(authService, 'logout');
      const routerSpy = vi.spyOn(router, 'navigate');

      // Test authentication check
      component.authenticatedLogin();
      expect(authLoginSpy).toHaveBeenCalled();

      // Test logout flow
      component.logout();
      expect(authLogoutSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['login']);
    });

    it('should handle service dependencies correctly', () => {
      expect(component).toBeDefined();
      expect(TestBed.inject(AuthService)).toBe(mockAuthService);
      expect(TestBed.inject(Router)).toBe(mockRouter);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize properly on component creation', () => {
      // Component should be created without errors
      expect(component).toBeTruthy();
      expect(component).toBeInstanceOf(HeaderComponent);
    });

    it('should maintain state consistency throughout lifecycle', () => {
      // Ensure mocks are clean before testing
      mockAuthService.logout.mockReset();
      mockRouter.navigate.mockReset();

      // Test initial state
      expect(component).toBeDefined();

      // Test after first change detection
      fixture.detectChanges();
      expect(component).toBeDefined();

      // Test after user interaction
      component.authenticatedLogin();
      expect(component).toBeDefined();

      component.logout();
      expect(component).toBeDefined();
    });

    it('should handle multiple component instances independently', () => {
      const fixture2 = TestUtils.createFixture(HeaderComponent);
      const component2 = fixture2.componentInstance;

      expect(component).not.toBe(component2);
      expect(component).toBeInstanceOf(HeaderComponent);
      expect(component2).toBeInstanceOf(HeaderComponent);
    });
  });
});
