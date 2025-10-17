import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { AccountRemoveService } from './account-remove-service';
import { AccountType } from './account';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('AccountRemoveService', () => {
  let service: AccountRemoveService;
  let mockHttpClient: HttpClient;
  const testAccountType = AccountType.DEBIT;

  beforeEach(async () => {
    // Setup mock for HttpClient
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      head: vi.fn(),
      options: vi.fn(),
      request: vi.fn(),
    } as unknown as HttpClient;

    await TestUtils.setupServiceTestBed(AccountRemoveService, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    service = new AccountRemoveService(mockHttpClient, testAccountType);
  });

  // Basic service structure tests using TestUtils
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct service structure', () => {
    TestUtils.testServiceStructure(service, AccountRemoveService);
    expect(service).toBeInstanceOf(AccountRemoveService);
  });

  it('should implement required methods', () => {
    TestUtils.testServiceMethods(service, ['remove']);
    expect(typeof service.remove).toBe('function');
  });

  it('should have correct method signatures', () => {
    TestUtils.testServiceMethodSignatures(service, [{ methodName: 'remove', parameterCount: 1 }]);
    expect(service.remove).toBeDefined();
  });

  // Functional tests
  describe('remove method', () => {
    it('should call HTTP DELETE with correct parameters for debit accounts', () => {
      const accountId = 'account-to-delete';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      service.remove(accountId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitAccounts/${accountId}`,
      );
    });

    it('should call HTTP DELETE with correct parameters for credit accounts', () => {
      const creditService = new AccountRemoveService(mockHttpClient, AccountType.CREDIT);
      const accountId = 'credit-account-to-delete';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      creditService.remove(accountId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditAccounts/${accountId}`,
      );
    });

    it('should call HTTP DELETE with correct parameters for equity accounts', () => {
      const equityService = new AccountRemoveService(mockHttpClient, AccountType.EQUITY);
      const accountId = 'equity-account-to-delete';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      equityService.remove(accountId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityAccounts/${accountId}`,
      );
    });

    it('should return void on successful removal', async () => {
      const accountId = 'test-account';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(accountId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
    });

    it('should handle HTTP errors correctly', async () => {
      const accountId = 'test-account';
      const errorResponse = new HttpErrorResponse({
        error: 'Deletion failed',
        status: 500,
        statusText: 'Internal Server Error',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(accountId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should handle network errors', async () => {
      const accountId = 'test-account';
      const networkError = new Error('Network error');

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(accountId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should handle account not found errors', async () => {
      const nonExistentId = 'non-existent-account';
      const notFoundError = new HttpErrorResponse({
        error: 'Account not found',
        status: 404,
        statusText: 'Not Found',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => notFoundError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(nonExistentId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should handle constraint violation errors', async () => {
      const accountId = 'account-with-dependencies';
      const constraintError = new HttpErrorResponse({
        error: { message: 'Cannot delete account with existing entries' },
        status: 409,
        statusText: 'Conflict',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => constraintError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(accountId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 409,
        error: { message: 'Cannot delete account with existing entries' },
      });
    });

    it('should return Observable<void>', () => {
      const accountId = 'test-account';
      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = service.remove(accountId);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should work with different account ID formats', async () => {
      const testIds = [
        'simple-id',
        'account-with-spaces',
        '123-numeric-id',
        'special!@#$%^&*()_+',
        'very-long-account-id-with-many-characters-and-numbers-12345',
      ];

      for (const accountId of testIds) {
        (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

        await new Promise<void>((resolve, reject) => {
          service.remove(accountId).subscribe({
            next: resolve,
            error: reject,
          });
        });

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
          `${environment.apiUrl}/debitAccounts/${accountId}`,
        );
      }
    });

    it('should handle authorization errors', async () => {
      const accountId = 'protected-account';
      const authError = new HttpErrorResponse({
        error: 'Unauthorized',
        status: 403,
        statusText: 'Forbidden',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => authError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(accountId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 403,
        statusText: 'Forbidden',
      });
    });

    it('should handle timeout errors', async () => {
      const accountId = 'slow-delete-account';
      const timeoutError = new HttpErrorResponse({
        error: 'Request timeout',
        status: 408,
        statusText: 'Request Timeout',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => timeoutError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(accountId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 408,
        statusText: 'Request Timeout',
      });
    });
  });

  describe('AccountType Integration', () => {
    it('should work with DEBIT type', () => {
      const debitService = new AccountRemoveService(mockHttpClient, AccountType.DEBIT);
      const accountId = 'test-debit-account';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      debitService.remove(accountId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitAccounts/${accountId}`,
      );
    });

    it('should work with CREDIT type', () => {
      const creditService = new AccountRemoveService(mockHttpClient, AccountType.CREDIT);
      const accountId = 'test-credit-account';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      creditService.remove(accountId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditAccounts/${accountId}`,
      );
    });

    it('should work with EQUITY type', () => {
      const equityService = new AccountRemoveService(mockHttpClient, AccountType.EQUITY);
      const accountId = 'test-equity-account';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      equityService.remove(accountId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityAccounts/${accountId}`,
      );
    });

    it('should format account type to lowercase for URL', () => {
      const debitService = new AccountRemoveService(mockHttpClient, AccountType.DEBIT);
      const accountId = 'test-account';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      debitService.remove(accountId).subscribe();

      // Verify that 'Debit' is converted to 'debitAccounts'
      expect(mockHttpClient.delete).toHaveBeenCalledWith(expect.stringContaining('debitAccounts'));
      expect(mockHttpClient.delete).not.toHaveBeenCalledWith(
        expect.stringContaining('DebitAccounts'),
      );
    });
  });

  describe('Constructor', () => {
    it('should initialize with HttpClient and AccountType', () => {
      const customService = new AccountRemoveService(mockHttpClient, AccountType.CREDIT);
      expect(customService).toBeDefined();
      expect(customService).toBeInstanceOf(AccountRemoveService);
    });

    it('should accept different AccountType values', () => {
      const debitService = new AccountRemoveService(mockHttpClient, AccountType.DEBIT);
      const creditService = new AccountRemoveService(mockHttpClient, AccountType.CREDIT);
      const equityService = new AccountRemoveService(mockHttpClient, AccountType.EQUITY);

      expect(debitService).toBeInstanceOf(AccountRemoveService);
      expect(creditService).toBeInstanceOf(AccountRemoveService);
      expect(equityService).toBeInstanceOf(AccountRemoveService);
    });
  });
});
