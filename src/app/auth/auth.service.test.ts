import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { AuthService, LoginResponse } from './auth.service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

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
const MOCK_LOGIN_RESPONSE = { login: 'testuser', expiresIn: 3600 };

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
  describe('Service Structure', () => {
    it('should be created successfully', () => {
      TestUtils.testServiceStructure(service, AuthService);
      expect(service).toBeTruthy();
    });

    it('should be a singleton service', () => {
      TestUtils.testServiceSingleton(AuthService);
      expect(TestBed.inject(AuthService)).toBe(TestBed.inject(AuthService));
    });

    it('should have all expected public methods', () => {
      const expectedMethods = [
        'signin',
        'loadSession',
        'logout',
        'isAuthenticated',
        'ensureAuthenticated',
        'authenticatedLogin',
        'clearSession',
      ];
      TestUtils.testServiceMethods(service, expectedMethods);
      expect(expectedMethods.length).toBe(7);
    });

    it('should have correct method signatures', () => {
      const methodSignatures = [
        { methodName: 'signin', parameterCount: 2 },
        { methodName: 'loadSession', parameterCount: 0 },
        { methodName: 'logout', parameterCount: 0 },
        { methodName: 'isAuthenticated', parameterCount: 0 },
        { methodName: 'ensureAuthenticated', parameterCount: 0 },
        { methodName: 'authenticatedLogin', parameterCount: 0 },
        { methodName: 'clearSession', parameterCount: 0 },
      ];
      TestUtils.testServiceMethodSignatures(service, methodSignatures);
      expect(methodSignatures.length).toBe(7);
    });
  });

  // LoginResponse class tests
  describe('LoginResponse Class', () => {
    it('should create LoginResponse instance correctly', () => {
      const login = 'testuser';
      const expiresIn = 3600;

      const loginResponse = new LoginResponse(login, expiresIn);

      expect(loginResponse).toBeInstanceOf(LoginResponse);
      expect(loginResponse.login).toBe(login);
      expect(loginResponse.expiresIn).toBe(expiresIn);
    });
  });

  describe('Authentication Methods', () => {
    describe('signin', () => {
      it('should make POST request to correct endpoint', () => {
        const username = TEST_USERNAME;
        const password = TEST_PASSWORD;
        const expectedResponse = MOCK_LOGIN_RESPONSE;

        service.signin(username, password).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.withCredentials).toBe(true);
        expect(req.request.body).toEqual({ username, password });

        req.flush(expectedResponse);
      });

      it('should return observable with LoginResponse', () => {
        const username = TEST_USERNAME;
        const password = TEST_PASSWORD;
        const expectedResponse = MOCK_LOGIN_RESPONSE;

        let actualResponse: LoginResponse;
        service.signin(username, password).subscribe((response) => {
          actualResponse = response;
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        req.flush(expectedResponse);

        expect(actualResponse!).toEqual(expectedResponse);
        expect(actualResponse!.login).toBe(expectedResponse.login);
        expect(actualResponse!.expiresIn).toBe(3600);
      });

      it('should set session on successful signin', () => {
        mockDateNow.mockReturnValue(1703181600000);
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        req.flush(MOCK_LOGIN_RESPONSE);

        expect(service.isAuthenticated()).toBe(true);
        expect(service.authenticatedLogin()).toBe('testuser');
      });
    });

    describe('logout', () => {
      it('should call backend logout endpoint', () => {
        service.logout().subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
        expect(req.request.method).toBe('POST');
        expect(req.request.withCredentials).toBe(true);
        req.flush({});
      });

      it('should clear session after logout', () => {
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        loginReq.flush(MOCK_LOGIN_RESPONSE);

        expect(service.isAuthenticated()).toBe(true);

        service.logout().subscribe();
        const logoutReq = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
        logoutReq.flush({});

        expect(service.isAuthenticated()).toBe(false);
        expect(service.authenticatedLogin()).toBe('');
      });
    });
  });

  describe('Session Management', () => {
    describe('loadSession', () => {
      it('should load session from /auth/me', () => {
        service.loadSession().subscribe((response) => {
          expect(response).toEqual(MOCK_LOGIN_RESPONSE);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
        expect(req.request.method).toBe('GET');
        expect(req.request.withCredentials).toBe(true);
        req.flush(MOCK_LOGIN_RESPONSE);

        expect(service.isAuthenticated()).toBe(true);
        expect(service.authenticatedLogin()).toBe('testuser');
      });

      it('should return null when session is not available', () => {
        service.loadSession().subscribe((response) => {
          expect(response).toBeNull();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
        req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

        expect(service.isAuthenticated()).toBe(false);
      });
    });

    describe('isAuthenticated', () => {
      it('should return true when session is valid', () => {
        mockDateNow.mockReturnValue(1703181600000);
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        req.flush(MOCK_LOGIN_RESPONSE);

        expect(service.isAuthenticated()).toBe(true);
      });

      it('should return false when session is expired', () => {
        mockDateNow.mockReturnValue(1703181600000);
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        req.flush(MOCK_LOGIN_RESPONSE);

        mockDateNow.mockReturnValue(1703181600000 + 3600 * 1000 + 1);
        expect(service.isAuthenticated()).toBe(false);
        expect(service.authenticatedLogin()).toBe('');
      });
    });

    describe('ensureAuthenticated', () => {
      it('should return true when session is already loaded', () => {
        service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
        req.flush(MOCK_LOGIN_RESPONSE);

        service.ensureAuthenticated().subscribe((result) => {
          expect(result).toBe(true);
        });

        httpMock.expectNone(`${environment.apiUrl}/auth/me`);
      });

      it('should load session when none is available', () => {
        service.ensureAuthenticated().subscribe((result) => {
          expect(result).toBe(true);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
        req.flush(MOCK_LOGIN_RESPONSE);
      });

      it('should return false when session cannot be loaded', () => {
        service.ensureAuthenticated().subscribe((result) => {
          expect(result).toBe(false);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
        req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
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
      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(expectedResponse);

      // Now authenticated
      expect(service.isAuthenticated()).toBe(true);
      expect(service.authenticatedLogin()).toBe('testuser');

      // Logout
      service.logout().subscribe();
      const logoutReq = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      logoutReq.flush({});

      // No longer authenticated
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('Performance Considerations', () => {
    it('should not make unnecessary HTTP calls on token checks', () => {
      service.signin(TEST_USERNAME, TEST_PASSWORD).subscribe();
      const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
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
