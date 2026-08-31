import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { AccountUpdateService } from './account-update-service';
import { Account, accountId, AccountType } from './account';
import { TestUtils, createHttpClientTestMock } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('AccountUpdateService', () => {
  let service: AccountUpdateService;
  let mockHttpClient: HttpClient;
  const testAccountType = AccountType.DEBIT;

  beforeEach(async () => {
    mockHttpClient = createHttpClientTestMock();

    await TestUtils.setupServiceTestBed(AccountUpdateService, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    service = new AccountUpdateService(mockHttpClient, testAccountType);
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

    it.each([
      {
        id: 'test-account',
        account: { description: '', category: '' },
      },
      {
        id: 'special-account',
        account: {
          description: 'Account & Co. Ltd. (Updated)',
          category: 'Category <Special> "Test"',
        },
      },
    ])('should update account payload variants ($id)', async ({ id, account }) => {
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(account));

      const result = await new Promise<Account>((resolve, reject) => {
        service.update(id, account).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe(account.description);
      expect(result.category).toBe(account.category);
      expect(accountId(result)).toBe(account.description);
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
});
