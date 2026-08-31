import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { AccountInsertService } from './account-insert-service';
import { Account, accountId, AccountType, createAccount } from './account';
import { TestUtils, createHttpClientTestMock } from '../shared/test-utils';
import { environment } from '../../environments/environment';
import { PATHS } from '../app.paths';

describe('AccountInsertService', () => {
  let service: AccountInsertService;
  let mockHttpClient: HttpClient;
  const testAccountType = AccountType.DEBIT;

  beforeEach(async () => {
    mockHttpClient = createHttpClientTestMock();

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
      const testAccount = { description: 'Test Account', category: 'Test Category' };
      const expectedResponse = { description: 'Test Account', category: 'Test Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/debit${PATHS.ACCOUNT_PATH}`,
        testAccount,
      );
    });

    it('should call HTTP POST with correct parameters for credit accounts', () => {
      const creditService = new AccountInsertService(mockHttpClient, AccountType.CREDIT);
      const testAccount = { description: 'Credit Account', category: 'Credit Category' };
      const expectedResponse = { description: 'Credit Account', category: 'Credit Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      creditService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/credit${PATHS.ACCOUNT_PATH}`,
        testAccount,
      );
    });

    it('should call HTTP POST with correct parameters for equity accounts', () => {
      const equityService = new AccountInsertService(mockHttpClient, AccountType.EQUITY);
      const testAccount = { description: 'Equity Account', category: 'Equity Category' };
      const expectedResponse = { description: 'Equity Account', category: 'Equity Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      equityService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/equity${PATHS.ACCOUNT_PATH}`,
        testAccount,
      );
    });

    it('should return transformed Account on successful insert', async () => {
      const inputAccount = { description: 'New Account', category: 'New Category' };
      const mockResponse = { description: 'New Account', category: 'New Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.insert(inputAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('New Account');
      expect(result.category).toBe('New Category');
      expect(accountId(result)).toBe('New Account');
    });

    it('should handle HTTP errors correctly', async () => {
      const testAccount = { description: 'Test Account', category: 'Test Category' };
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
      const testAccount = { description: 'Test Account', category: 'Test Category' };
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
      const emptyAccount = { description: '', category: '' };
      const mockResponse = { description: '', category: '' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Account>((resolve, reject) => {
        service.insert(emptyAccount).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('');
      expect(result.category).toBe('');
      expect(accountId(result)).toBe('');
    });

    it('should work with special characters in description and category', async () => {
      const specialAccount = {
        description: 'Account & Co. Ltd. (Main)',
        category: 'Category <Special> "Test"',
      };
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

      expect(result.description).toBe('Account & Co. Ltd. (Main)');
      expect(result.category).toBe('Category <Special> "Test"');
      expect(accountId(result)).toBe('Account & Co. Ltd. (Main)');
    });

    it('should handle server validation errors', async () => {
      const testAccount = { description: 'Test Account', category: 'Test Category' };
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
      const testAccount = { description: 'Test Account', category: 'Test Category' };
      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(testAccount));

      const result = service.insert(testAccount);
      expect(result).toBeInstanceOf(Observable);
    });
  });

  // Test different AccountType configurations
  describe('AccountType integration', () => {
    it('should work with DEBIT type', () => {
      const debitService = new AccountInsertService(mockHttpClient, AccountType.DEBIT);
      const testAccount = { description: 'Debit Account', category: 'Assets' };
      const expectedResponse = { description: 'Debit Account', category: 'Assets' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      debitService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/debit${PATHS.ACCOUNT_PATH}`,
        testAccount,
      );
    });

    it('should work with CREDIT type', () => {
      const creditService = new AccountInsertService(mockHttpClient, AccountType.CREDIT);
      const testAccount = { description: 'Credit Account', category: 'Liabilities' };
      const expectedResponse = { description: 'Credit Account', category: 'Liabilities' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      creditService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/credit${PATHS.ACCOUNT_PATH}`,
        testAccount,
      );
    });

    it('should work with EQUITY type', () => {
      const equityService = new AccountInsertService(mockHttpClient, AccountType.EQUITY);
      const testAccount = { description: 'Equity Account', category: 'Capital' };
      const expectedResponse = { description: 'Equity Account', category: 'Capital' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      equityService.insert(testAccount).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/equity${PATHS.ACCOUNT_PATH}`,
        testAccount,
      );
    });

    it('should format account type to lowercase for URL', () => {
      const debitService = new AccountInsertService(mockHttpClient, AccountType.DEBIT);
      const testAccount = { description: 'Test Account', category: 'Test Category' };

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
      expect(newAccount.description).toBe('');
      expect(newAccount.category).toBe('');
      expect(accountId(newAccount)).toBe('');
    });
  });

  // Test service constructor
  describe('Constructor', () => {
    it('should initialize with HttpClient and AccountType', () => {
      const customService = new AccountInsertService(mockHttpClient, AccountType.CREDIT);
      expect(customService).toBeDefined();
      expect(customService).toBeInstanceOf(AccountInsertService);
    });
  });
});
