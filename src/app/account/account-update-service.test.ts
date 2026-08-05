import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { AccountUpdateService } from './account-update-service';
import { Account, accountId, AccountType, createAccount } from './account';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('AccountUpdateService', () => {
  let service: AccountUpdateService;
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

    await TestUtils.setupServiceTestBed(AccountUpdateService, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    service = new AccountUpdateService(mockHttpClient, testAccountType);
  });

  // Basic service structure tests using TestUtils
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct service structure', () => {
    TestUtils.testServiceStructure(service, AccountUpdateService);
    expect(service).toBeInstanceOf(AccountUpdateService);
  });

  it('should implement required methods', () => {
    TestUtils.testServiceMethods(service, ['update']);
    expect(typeof service.update).toBe('function');
  });

  it('should have correct method signatures', () => {
    TestUtils.testServiceMethodSignatures(service, [{ methodName: 'update', parameterCount: 2 }]);
    expect(service.update).toBeDefined();
  });

  // Functional tests
  describe('update method', () => {
    it('should call HTTP PUT with correct parameters for debit accounts', () => {
      const accountId = 'existing-account';
      const updatedAccount = { description: 'Updated Account', category: 'Updated Category' };
      const expectedResponse = { description: 'Updated Account', category: 'Updated Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(accountId, updatedAccount).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitAccounts/${accountId}`,
        updatedAccount,
      );
    });

    it('should call HTTP PUT with correct parameters for credit accounts', () => {
      const creditService = new AccountUpdateService(mockHttpClient, AccountType.CREDIT);
      const accountId = 'credit-account';
      const updatedAccount = { description: 'Credit Account', category: 'Credit Category' };
      const expectedResponse = { description: 'Credit Account', category: 'Credit Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      creditService.update(accountId, updatedAccount).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditAccounts/${accountId}`,
        updatedAccount,
      );
    });

    it('should call HTTP PUT with correct parameters for equity accounts', () => {
      const equityService = new AccountUpdateService(mockHttpClient, AccountType.EQUITY);
      const accountId = 'equity-account';
      const updatedAccount = { description: 'Equity Account', category: 'Equity Category' };
      const expectedResponse = { description: 'Equity Account', category: 'Equity Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      equityService.update(accountId, updatedAccount).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityAccounts/${accountId}`,
        updatedAccount,
      );
    });

    it('should return transformed Account on successful update', async () => {
      const testAccountId = 'test-account';
      const updatedAccount = { description: 'Updated Description', category: 'Updated Category' };
      const mockResponse = { description: 'Updated Description', category: 'Updated Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.update(testAccountId, updatedAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Updated Description');
      expect(result.category).toBe('Updated Category');
      expect(accountId(result)).toBe('Updated Description');
    });

    it('should handle HTTP errors correctly', async () => {
      const testAccountId = 'test-account';
      const updatedAccount = { description: 'Updated Account', category: 'Updated Category' };
      const errorResponse = new HttpErrorResponse({
        error: 'Update failed',
        status: 404,
        statusText: 'Not Found',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(testAccountId, updatedAccount).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should handle network errors', async () => {
      const testAccountId = 'test-account';
      const updatedAccount = { description: 'Updated Account', category: 'Updated Category' };
      const networkError = new Error('Network error');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(testAccountId, updatedAccount).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should work with empty description and category', async () => {
      const testAccountId = 'test-account';
      const emptyAccount = { description: '', category: '' };
      const mockResponse = { description: '', category: '' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.update(testAccountId, emptyAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('');
      expect(result.category).toBe('');
      expect(accountId(result)).toBe('');
    });

    it('should work with special characters in description and category', async () => {
      const testAccountId = 'special-account';
      const specialAccount = {
        description: 'Account & Co. Ltd. (Updated)',
        category: 'Category <Special> "Test"',
      };
      const mockResponse = {
        description: 'Account & Co. Ltd. (Updated)',
        category: 'Category <Special> "Test"',
      };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.update(testAccountId, specialAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Account & Co. Ltd. (Updated)');
      expect(result.category).toBe('Category <Special> "Test"');
      expect(accountId(result)).toBe('Account & Co. Ltd. (Updated)');
    });

    it('should handle server validation errors', async () => {
      const testAccountId = 'test-account';
      const updatedAccount = { description: 'Duplicate Description', category: 'Test Category' };
      const validationError = new HttpErrorResponse({
        error: { message: 'Account description already exists' },
        status: 422,
        statusText: 'Unprocessable Entity',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => validationError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(testAccountId, updatedAccount).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 422,
        error: { message: 'Account description already exists' },
      });
    });

    it('should handle account not found errors', async () => {
      const nonExistentId = 'non-existent-account';
      const updatedAccount = { description: 'Updated Description', category: 'Updated Category' };
      const notFoundError = new HttpErrorResponse({
        error: 'Account not found',
        status: 404,
        statusText: 'Not Found',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => notFoundError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(nonExistentId, updatedAccount).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should return Observable<Account>', () => {
      const testAccountId = 'test-account';
      const updatedAccount = { description: 'Updated Account', category: 'Updated Category' };
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(updatedAccount));

      const result = service.update(testAccountId, updatedAccount);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should work with different account ID formats', async () => {
      const testCases = [
        { id: 'simple-id', description: 'Simple Account', category: 'Simple Category' },
        {
          id: 'account-with-spaces',
          description: 'Account With Spaces',
          category: 'Category With Spaces',
        },
        { id: '123-numeric-id', description: 'Numeric ID Account', category: 'Numeric Category' },
        {
          id: 'special!@#$%^&*()_+',
          description: 'Special Chars Account',
          category: 'Special Chars Category',
        },
      ];

      for (const testCase of testCases) {
        const account = { description: testCase.description, category: testCase.category };
        const mockResponse = { description: testCase.description, category: testCase.category };

        (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

        const result = await new Promise<Account>((resolve, reject) => {
          service.update(testCase.id, account).subscribe({
            next: resolve,
            error: reject,
          });
        });

        expect(result.description).toBe(testCase.description);
        expect(result.category).toBe(testCase.category);
        expect(mockHttpClient.put).toHaveBeenCalledWith(
          `${environment.apiUrl}/debitAccounts/${testCase.id}`,
          account,
        );
      }
    });
  });

  describe('AccountType Integration', () => {
    it('should work with DEBIT type', () => {
      const debitService = new AccountUpdateService(mockHttpClient, AccountType.DEBIT);
      const testAccountId = 'test-debit';
      const account = { description: 'Debit Account', category: 'Assets' };
      const expectedResponse = { description: 'Debit Account', category: 'Assets' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      debitService.update(testAccountId, account).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitAccounts/${testAccountId}`,
        account,
      );
    });

    it('should work with CREDIT type', () => {
      const creditService = new AccountUpdateService(mockHttpClient, AccountType.CREDIT);
      const testAccountId = 'test-credit';
      const account = { description: 'Credit Account', category: 'Liabilities' };
      const expectedResponse = { description: 'Credit Account', category: 'Liabilities' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      creditService.update(testAccountId, account).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditAccounts/${testAccountId}`,
        account,
      );
    });

    it('should work with EQUITY type', () => {
      const equityService = new AccountUpdateService(mockHttpClient, AccountType.EQUITY);
      const testAccountId = 'test-equity';
      const account = { description: 'Equity Account', category: 'Capital' };
      const expectedResponse = { description: 'Equity Account', category: 'Capital' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      equityService.update(testAccountId, account).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityAccounts/${testAccountId}`,
        account,
      );
    });

    it('should format account type to lowercase for URL', () => {
      const debitService = new AccountUpdateService(mockHttpClient, AccountType.DEBIT);
      const testAccountId = 'test-account';
      const account = { description: 'Test Account', category: 'Test Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(account));

      debitService.update(testAccountId, account).subscribe();

      // Verify that 'Debit' is converted to 'debitAccounts'
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        expect.stringContaining('debitAccounts'),
        account,
      );
      expect(mockHttpClient.put).not.toHaveBeenCalledWith(
        expect.stringContaining('DebitAccounts'),
        account,
      );
    });
  });

  // Test createAccount factory function integration
  describe('createAccount integration', () => {
    it('should work with createAccount factory', () => {
      const newAccount = createAccount();
      expect(newAccount.description).toBe('');
      expect(newAccount.category).toBe('');
      expect(accountId(newAccount)).toBe('');
    });
  });

  describe('Constructor', () => {
    it('should initialize with HttpClient and AccountType', () => {
      const customService = new AccountUpdateService(mockHttpClient, AccountType.CREDIT);
      expect(customService).toBeDefined();
      expect(customService).toBeInstanceOf(AccountUpdateService);
    });

    it('should accept different AccountType values', () => {
      const debitService = new AccountUpdateService(mockHttpClient, AccountType.DEBIT);
      const creditService = new AccountUpdateService(mockHttpClient, AccountType.CREDIT);
      const equityService = new AccountUpdateService(mockHttpClient, AccountType.EQUITY);

      expect(debitService).toBeInstanceOf(AccountUpdateService);
      expect(creditService).toBeInstanceOf(AccountUpdateService);
      expect(equityService).toBeInstanceOf(AccountUpdateService);
    });
  });
});
