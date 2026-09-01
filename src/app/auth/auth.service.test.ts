import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { AuthService } from './auth.service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';
import { API_PATHS } from '../app.api-paths';

// Mock Date.now for consistent testing
const mockDateNow = vi.fn();
Object.defineProperty(Date, 'now', {
  value: mockDateNow,
  writable: true,
});

// Test constants - safe hardcoded values for testing
const TEST_USERNAME = 'testuser';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const TEST_PASSWORD = 'test-password-123';
const MOCK_LOGIN_RESPONSE = { login: 'testuser', token: 'jwt-token-123', expiresIn: 3600 };

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestUtils.setupServiceTestBed(AuthService, [
      provideHttpClient(),
      provideHttpClientTesting(),
    ]);

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Reset all mocks
    vi.clearAllMocks();
    mockDateNow.mockReturnValue(1703181600000); // Fixed timestamp: 2023-12-21
  });

  afterEach(() => {
    httpMock.verify();
    vi.clearAllMocks();
  });

  // Basic service structure tests using TestUtils
  describe('Authentication Methods', () => {
    describe('signin', () => {
      it('should set session on successful signin', () => {
        mockDateNow.mockReturnValue(1703181600000);
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGIN_PATH}`);
        req.flush(MOCK_LOGIN_RESPONSE);

        expect(service.isAuthenticated()).toBe(true);
        expect(service.authenticatedLogin()).toBe('testuser');
      });
    });

    describe('logout', () => {
      it('should call backend logout endpoint', () => {
        service.logout().subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGOUT_PATH}`);
        expect(req.request.method).toBe('POST');
        expect(req.request.withCredentials).toBe(false);
        req.flush({});
      });

      it('should clear session after logout', () => {
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const loginReq = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGIN_PATH}`);
        loginReq.flush(MOCK_LOGIN_RESPONSE);

        expect(service.isAuthenticated()).toBe(true);

        service.logout().subscribe();
        const logoutReq = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGOUT_PATH}`);
        logoutReq.flush({});

        expect(service.isAuthenticated()).toBe(false);
        expect(service.authenticatedLogin()).toBe('');
      });
    });
  });

  describe('Session Management', () => {
    describe('isAuthenticated', () => {
      it('should return true when session is valid', () => {
        mockDateNow.mockReturnValue(1703181600000);
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGIN_PATH}`);
        req.flush(MOCK_LOGIN_RESPONSE);

        expect(service.isAuthenticated()).toBe(true);
      });

      it('should return false when session is expired', () => {
        mockDateNow.mockReturnValue(1703181600000);
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGIN_PATH}`);
        req.flush(MOCK_LOGIN_RESPONSE);

        mockDateNow.mockReturnValue(1703181600000 + 3600 * 1000 + 1);
        expect(service.isAuthenticated()).toBe(false);
        expect(service.authenticatedLogin()).toBe('');
      });
    });

    describe('ensureAuthenticated', () => {
      it('should return true when session is already loaded', () => {
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGIN_PATH}`);
        req.flush(MOCK_LOGIN_RESPONSE);

        service.ensureAuthenticated().subscribe((result) => {
          expect(result).toBe(true);
        });
      });

      it('should return false when no session is available', () => {
        service.ensureAuthenticated().subscribe((result) => {
          expect(result).toBe(false);
        });

        httpMock.expectNone(() => true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should complete full authentication flow', () => {
      const username = 'integrationuser';
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      const password = 'integration-test-pass';
      const expectedResponse = MOCK_LOGIN_RESPONSE;

      // Initially not authenticated
      expect(service.isAuthenticated()).toBe(false);

      // Sign in
      service.signin(username, password).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGIN_PATH}`);
      req.flush(expectedResponse);

      // Now authenticated
      expect(service.isAuthenticated()).toBe(true);
      expect(service.authenticatedLogin()).toBe('testuser');

      // Logout
      service.logout().subscribe();
      const logoutReq = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGOUT_PATH}`);
      logoutReq.flush({});

      // No longer authenticated
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('Performance Considerations', () => {
    it('should not make unnecessary HTTP calls on token checks', () => {
      service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
      const loginReq = httpMock.expectOne(`${environment.apiUrl}/${API_PATHS.AUTH_LOGIN_PATH}`);
      loginReq.flush(MOCK_LOGIN_RESPONSE);

      // Multiple authentication checks should not trigger HTTP requests
      const authResult1 = service.isAuthenticated();
      const authResult2 = service.isAuthenticated();
      const login = service.authenticatedLogin();

      expect(authResult1).toBe(true);
      expect(authResult2).toBe(true);
      expect(login).toBe('testuser');
      httpMock.expectNone(() => true);
    });
  });
});
