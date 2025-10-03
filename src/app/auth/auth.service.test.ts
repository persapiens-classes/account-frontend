import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { AuthService, LoginResponse } from './auth.service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

// Mock JWT tokens for testing
const mockJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTcwMzE4MTYwMH0.mock_signature';
const mockExpiredJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTYwMzE4MTYwMH0.mock_signature';
const mockInvalidJwt = 'invalid.jwt.token';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock Date.now for consistent testing
const mockDateNow = vi.fn();
Object.defineProperty(Date, 'now', {
  value: mockDateNow,
  writable: true,
});

// Mock console.log to avoid test output pollution
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
  // Intentionally empty to suppress console output in tests
});

// Test constants - safe hardcoded values for testing
const TEST_USERNAME = 'testuser';
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const TEST_PASSWORD = 'test-password-123';

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
        'logout',
        'isAuthenticated',
        'authenticatedLogin',
        'getTokenExpiration',
        'isTokenExpired',
        'authenticatedToken',
      ];
      TestUtils.testServiceMethods(service, expectedMethods);
      expect(expectedMethods.length).toBe(7);
    });

    it('should have correct method signatures', () => {
      const methodSignatures = [
        { methodName: 'signin', parameterCount: 2 },
        { methodName: 'logout', parameterCount: 0 },
        { methodName: 'isAuthenticated', parameterCount: 0 },
        { methodName: 'authenticatedLogin', parameterCount: 0 },
        { methodName: 'getTokenExpiration', parameterCount: 0 },
        { methodName: 'isTokenExpired', parameterCount: 0 },
        { methodName: 'authenticatedToken', parameterCount: 0 },
      ];
      TestUtils.testServiceMethodSignatures(service, methodSignatures);
      expect(methodSignatures.length).toBe(7);
    });
  });

  // LoginResponse class tests
  describe('LoginResponse Class', () => {
    it('should create LoginResponse instance correctly', () => {
      const token = 'test-token';
      const expiresIn = 3600;

      const loginResponse = new LoginResponse(token, expiresIn);

      expect(loginResponse).toBeInstanceOf(LoginResponse);
      expect(loginResponse.token).toBe(token);
      expect(loginResponse.expiresIn).toBe(expiresIn);
    });
  });

  describe('Authentication Methods', () => {
    describe('signin', () => {
      it('should make POST request to correct endpoint', () => {
        const username = TEST_USERNAME;
        const password = TEST_PASSWORD;
        const expectedResponse = new LoginResponse(mockJwt, 3600);

        service.signin(username, password).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ username, password });

        req.flush(expectedResponse);
      });

      it('should store token in localStorage on successful signin', () => {
        const username = TEST_USERNAME;
        const password = TEST_PASSWORD;
        const expectedResponse = new LoginResponse(mockJwt, 3600);

        service.signin(username, password).subscribe();

        const req = httpMock.expectOne(`${environment.apiUrl}/login`);
        req.flush(expectedResponse);

        expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockJwt);
        expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      });

      it('should return observable with LoginResponse', () => {
        const username = TEST_USERNAME;
        const password = TEST_PASSWORD;
        const expectedResponse = new LoginResponse(mockJwt, 3600);

        let actualResponse: LoginResponse;
        service.signin(username, password).subscribe((response) => {
          actualResponse = response;
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/login`);
        req.flush(expectedResponse);

        expect(actualResponse!).toEqual(expectedResponse);
        expect(actualResponse!.token).toBe(mockJwt);
        expect(actualResponse!.expiresIn).toBe(3600);
      });
    });

    describe('logout', () => {
      it('should remove token from localStorage', () => {
        service.logout();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
        expect(localStorageMock.removeItem).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Token Management', () => {
    describe('authenticatedToken', () => {
      it('should return token from localStorage', () => {
        localStorageMock.getItem.mockReturnValue(mockJwt);

        const token = service.authenticatedToken();

        expect(token).toBe(mockJwt);
        expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
      });

      it('should return null when no token exists', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const token = service.authenticatedToken();

        expect(token).toBeNull();
        expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
      });
    });

    describe('isAuthenticated', () => {
      it('should return true when valid token exists', () => {
        localStorageMock.getItem.mockReturnValue(mockJwt);

        const isAuth = service.isAuthenticated();

        expect(isAuth).toBe(true);
      });

      it('should return false when no token exists', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const isAuth = service.isAuthenticated();

        expect(isAuth).toBe(false);
      });
    });
  });

  describe('JWT Token Handling', () => {
    describe('authenticatedLogin', () => {
      it('should return username from JWT token', () => {
        localStorageMock.getItem.mockReturnValue(mockJwt);

        const login = service.authenticatedLogin();

        expect(login).toBe('testuser');
      });

      it('should return empty string when token has no sub claim', () => {
        // Test JWT without sub claim - not a real secret
        const tokenWithoutSub =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDMxODE2MDB9.mock_signature'; // eslint-disable-line sonarjs/no-hardcoded-secrets
        localStorageMock.getItem.mockReturnValue(tokenWithoutSub);

        const login = service.authenticatedLogin();

        expect(login).toBe('');
      });
    });

    describe('getTokenExpiration', () => {
      it('should return expiration timestamp in milliseconds', () => {
        localStorageMock.getItem.mockReturnValue(mockJwt);

        const expiration = service.getTokenExpiration();

        expect(expiration).toBe(1703181600000); // exp: 1703181600 * 1000
      });

      it('should return null when no token exists', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const expiration = service.getTokenExpiration();

        expect(expiration).toBeNull();
      });

      it('should return null and log error for invalid JWT', () => {
        localStorageMock.getItem.mockReturnValue(mockInvalidJwt);

        const expiration = service.getTokenExpiration();

        expect(expiration).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('could not decode jwt:'));
      });
    });

    describe('isTokenExpired', () => {
      it('should return false for valid non-expired token', () => {
        localStorageMock.getItem.mockReturnValue(mockJwt);
        mockDateNow.mockReturnValue(1703181500000); // Before expiration

        const isExpired = service.isTokenExpired();

        expect(isExpired).toBe(false);
      });

      it('should return true for expired token', () => {
        localStorageMock.getItem.mockReturnValue(mockExpiredJwt);
        mockDateNow.mockReturnValue(1703181600000); // After expiration

        const isExpired = service.isTokenExpired();

        expect(isExpired).toBe(true);
      });

      it('should return true when no token exists', () => {
        localStorageMock.getItem.mockReturnValue(null);

        const isExpired = service.isTokenExpired();

        expect(isExpired).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should complete full authentication flow', () => {
      const username = 'integrationuser';
      // eslint-disable-next-line sonarjs/no-hardcoded-passwords
      const password = 'integration-test-pass';
      const expectedResponse = new LoginResponse(mockJwt, 3600);

      // Initially not authenticated
      localStorageMock.getItem.mockReturnValue(null);
      expect(service.isAuthenticated()).toBe(false);

      // Sign in
      service.signin(username, password).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      req.flush(expectedResponse);

      // Token should be stored
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockJwt);

      // Now authenticated
      localStorageMock.getItem.mockReturnValue(mockJwt);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.authenticatedLogin()).toBe('testuser');
      expect(service.isTokenExpired()).toBe(false);

      // Logout
      service.logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');

      // No longer authenticated
      localStorageMock.getItem.mockReturnValue(null);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('Performance Considerations', () => {
    it('should not make unnecessary HTTP calls on token checks', () => {
      localStorageMock.getItem.mockReturnValue(mockJwt);

      // Multiple authentication checks should not trigger HTTP requests
      const authResult1 = service.isAuthenticated();
      const authResult2 = service.isAuthenticated();
      const login = service.authenticatedLogin();
      const expiration = service.getTokenExpiration();
      const expired = service.isTokenExpired();

      expect(authResult1).toBe(true);
      expect(authResult2).toBe(true);
      expect(login).toBe('testuser');
      expect(expiration).toBeDefined();
      expect(expired).toBe(false);
      httpMock.expectNone(() => true);
    });
  });
});
