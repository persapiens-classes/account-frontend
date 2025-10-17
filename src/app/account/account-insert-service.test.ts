import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { AccountInsertService } from './account-insert-service';
import { Account, AccountType, createAccount } from './account';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('AccountInsertService', () => {
  let service: AccountInsertService;
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

    await TestUtils.setupServiceTestBed(AccountInsertService, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    service = new AccountInsertService(mockHttpClient, testAccountType);
  });

  // Basic service structure tests using TestUtils
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct service structure', () => {
    TestUtils.testServiceStructure(service, AccountInsertService);
    expect(service).toBeInstanceOf(AccountInsertService);
  });

  it('should implement required methods', () => {
    TestUtils.testServiceMethods(service, ['insert']);
    expect(typeof service.insert).toBe('function');
  });

  it('should have correct method signatures', () => {
    TestUtils.testServiceMethodSignatures(service, [{ methodName: 'insert', parameterCount: 1 }]);
    expect(service.insert).toBeDefined();
  });

  // Functional tests
  describe('insert method', () => {
    it('should call HTTP POST with correct parameters for debit accounts', () => {
      const testAccount = new Account('Test Account', 'Test Category');
      const expectedResponse = new Account('Test Account', 'Test Category');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitAccounts`,
        testAccount,
      );
    });

    it('should call HTTP POST with correct parameters for credit accounts', () => {
      const creditService = new AccountInsertService(mockHttpClient, AccountType.CREDIT);
      const testAccount = new Account('Credit Account', 'Credit Category');
      const expectedResponse = new Account('Credit Account', 'Credit Category');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      creditService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditAccounts`,
        testAccount,
      );
    });

    it('should call HTTP POST with correct parameters for equity accounts', () => {
      const equityService = new AccountInsertService(mockHttpClient, AccountType.EQUITY);
      const testAccount = new Account('Equity Account', 'Equity Category');
      const expectedResponse = new Account('Equity Account', 'Equity Category');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      equityService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityAccounts`,
        testAccount,
      );
    });

    it('should return transformed Account on successful insert', async () => {
      const inputAccount = new Account('New Account', 'New Category');
      const mockResponse = { description: 'New Account', category: 'New Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.insert(inputAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Account);
      expect(result.description).toBe('New Account');
      expect(result.category).toBe('New Category');
      expect(result.getId()).toBe('New Account');
    });

    it('should handle HTTP errors correctly', async () => {
      const testAccount = new Account('Test Account', 'Test Category');
      const errorResponse = new HttpErrorResponse({
        error: 'Insert failed',
        status: 400,
        statusText: 'Bad Request',
      });

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testAccount).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 400,
        statusText: 'Bad Request',
      });
    });

    it('should handle network errors', async () => {
      const testAccount = new Account('Test Account', 'Test Category');
      const networkError = new Error('Network error');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testAccount).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should work with empty description and category', async () => {
      const emptyAccount = new Account('', '');
      const mockResponse = { description: '', category: '' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.insert(emptyAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Account);
      expect(result.description).toBe('');
      expect(result.category).toBe('');
      expect(result.getId()).toBe('');
    });

    it('should work with special characters in description and category', async () => {
      const specialAccount = new Account('Account & Co. Ltd. (Main)', 'Category <Special> "Test"');
      const mockResponse = {
        description: 'Account & Co. Ltd. (Main)',
        category: 'Category <Special> "Test"',
      };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.insert(specialAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Account);
      expect(result.description).toBe('Account & Co. Ltd. (Main)');
      expect(result.category).toBe('Category <Special> "Test"');
      expect(result.getId()).toBe('Account & Co. Ltd. (Main)');
    });

    it('should handle server validation errors', async () => {
      const testAccount = new Account('Test Account', 'Test Category');
      const validationError = new HttpErrorResponse({
        error: { message: 'Account description already exists' },
        status: 422,
        statusText: 'Unprocessable Entity',
      });

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => validationError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testAccount).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 422,
        error: { message: 'Account description already exists' },
      });
    });

    it('should return Observable<Account>', () => {
      const testAccount = new Account('Test Account', 'Test Category');
      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(testAccount));

      const result = service.insert(testAccount);
      expect(result).toBeInstanceOf(Observable);
    });
  });

  // Test different AccountType configurations
  describe('AccountType integration', () => {
    it('should work with DEBIT type', () => {
      const debitService = new AccountInsertService(mockHttpClient, AccountType.DEBIT);
      const testAccount = new Account('Debit Account', 'Assets');
      const expectedResponse = new Account('Debit Account', 'Assets');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      debitService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitAccounts`,
        testAccount,
      );
    });

    it('should work with CREDIT type', () => {
      const creditService = new AccountInsertService(mockHttpClient, AccountType.CREDIT);
      const testAccount = new Account('Credit Account', 'Liabilities');
      const expectedResponse = new Account('Credit Account', 'Liabilities');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      creditService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditAccounts`,
        testAccount,
      );
    });

    it('should work with EQUITY type', () => {
      const equityService = new AccountInsertService(mockHttpClient, AccountType.EQUITY);
      const testAccount = new Account('Equity Account', 'Capital');
      const expectedResponse = new Account('Equity Account', 'Capital');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      equityService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityAccounts`,
        testAccount,
      );
    });

    it('should format account type to lowercase for URL', () => {
      const debitService = new AccountInsertService(mockHttpClient, AccountType.DEBIT);
      const testAccount = new Account('Test Account', 'Test Category');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(testAccount));

      debitService.insert(testAccount).subscribe();

      // Verify that 'Debit' is converted to 'debitAccounts'
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        expect.stringContaining('debitAccounts'),
        testAccount,
      );
      expect(mockHttpClient.post).not.toHaveBeenCalledWith(
        expect.stringContaining('DebitAccounts'),
        testAccount,
      );
    });
  });

  // Test createAccount factory function integration
  describe('createAccount integration', () => {
    it('should work with createAccount factory', () => {
      const newAccount = createAccount();
      expect(newAccount).toBeInstanceOf(Account);
      expect(newAccount.description).toBe('');
      expect(newAccount.category).toBe('');
      expect(newAccount.getId()).toBe('');
    });
  });

  // Test service constructor
  describe('Constructor', () => {
    it('should initialize with HttpClient and AccountType', () => {
      const customService = new AccountInsertService(mockHttpClient, AccountType.CREDIT);
      expect(customService).toBeDefined();
      expect(customService).toBeInstanceOf(AccountInsertService);
    });

    it('should accept different AccountType values', () => {
      const debitService = new AccountInsertService(mockHttpClient, AccountType.DEBIT);
      const creditService = new AccountInsertService(mockHttpClient, AccountType.CREDIT);
      const equityService = new AccountInsertService(mockHttpClient, AccountType.EQUITY);

      expect(debitService).toBeInstanceOf(AccountInsertService);
      expect(creditService).toBeInstanceOf(AccountInsertService);
      expect(equityService).toBeInstanceOf(AccountInsertService);
    });
  });
});
