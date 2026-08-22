import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoryRemoveService } from './category-remove-service';
import { CategoryType } from './category';
import { createHttpClientTestMock } from '../shared/http-client-test-mock';
import { environment } from '../../environments/environment';
import { PATHS } from '../app.paths';

describe('CategoryRemoveService', () => {
  let service: CategoryRemoveService;
  let mockHttpClient: HttpClient;
  let categoryType: CategoryType;

  const expectRemoveError = async (
    categoryId: string,
    errorResponse: HttpErrorResponse,
  ): Promise<void> => {
    (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
      throwError(() => errorResponse),
    );

    await expect(
      new Promise((resolve, reject) => {
        service.remove(categoryId).subscribe({
          next: resolve,
          error: reject,
        });
      }),
    ).rejects.toMatchObject({
      status: errorResponse.status,
    });
  };

  const expectRemoveSuccess = async (categoryId: string): Promise<void> => {
    (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));
    const result = await new Promise<void>((resolve, reject) => {
      service.remove(categoryId).subscribe({ next: resolve, error: reject });
    });
    expect(result).toBeUndefined();
  };

  beforeEach(() => {
    mockHttpClient = createHttpClientTestMock();

    categoryType = CategoryType.DEBIT;
    service = new CategoryRemoveService(mockHttpClient, categoryType);
  });

  describe('Service Structure', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be an instance of CategoryRemoveService', () => {
      expect(service).toBeInstanceOf(CategoryRemoveService);
    });

    it('should have remove method', () => {
      expect(typeof service.remove).toBe('function');
    });

    it('should store http client', () => {
      expect(service['http']).toBe(mockHttpClient);
    });

    it('should store category type', () => {
      expect(service['type']).toBe(CategoryType.DEBIT);
    });
  });

  describe('remove method - DEBIT category', () => {
    it('should call HTTP DELETE with correct parameters', () => {
      const categoryId = 'Test Category';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      service.remove(categoryId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Test Category`,
      );
    });

    it('should complete successfully on valid removal', async () => {
      const categoryId = 'Category to Remove';
      await expectRemoveSuccess(categoryId);
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Category to Remove`,
      );
    });

    it('should handle HTTP errors correctly', async () => {
      await expectRemoveError(
        'Test Category',
        new HttpErrorResponse({
          error: 'Delete failed',
          status: 404,
          statusText: 'Not Found',
        }),
      );
    });

    it('should handle network errors', async () => {
      const categoryId = 'Test Category';
      const networkError = new Error('Network error');

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(categoryId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should handle categories with special characters in ID', async () => {
      const categoryId = 'Category & <Special> "Characters"';
      await expectRemoveSuccess(categoryId);
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Category & <Special> "Characters"`,
      );
    });

    it('should handle empty category ID', async () => {
      await expectRemoveSuccess('');
      expect(mockHttpClient.delete).toHaveBeenCalledWith(`${environment.apiUrl}/debitCategories/`);
    });
  });

  describe('remove method - non-debit categories', () => {
    it.each([
      {
        type: CategoryType.CREDIT,
        prefix: 'credit',
        urlId: 'Credit Category',
        successId: 'Revenue Category',
      },
      {
        type: CategoryType.EQUITY,
        prefix: 'equity',
        urlId: 'Equity Category',
        successId: 'Capital Category',
      },
    ])('should support $type removal flow', async ({ type, prefix, urlId, successId }) => {
      const typedService = new CategoryRemoveService(mockHttpClient, type);

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));
      typedService.remove(urlId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/${prefix}${PATHS.CATEGORY_PATH}/${urlId}`,
      );

      const result = await new Promise<void>((resolve, reject) => {
        typedService.remove(successId).subscribe({ next: resolve, error: reject });
      });

      expect(result).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 403 forbidden error', async () => {
      await expectRemoveError(
        'Protected Category',
        new HttpErrorResponse({
          error: 'Forbidden',
          status: 403,
          statusText: 'Forbidden',
        }),
      );
    });

    it('should handle 500 server error', async () => {
      await expectRemoveError(
        'Test Category',
        new HttpErrorResponse({
          error: 'Internal Server Error',
          status: 500,
          statusText: 'Internal Server Error',
        }),
      );
    });

    it('should handle 409 conflict error (category in use)', async () => {
      await expectRemoveError(
        'Category In Use',
        new HttpErrorResponse({
          error: { message: 'Category is in use' },
          status: 409,
          statusText: 'Conflict',
        }),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long category IDs', async () => {
      const longId = 'A'.repeat(1000);

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(longId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/${longId}`,
      );
    });

    it('should handle Unicode characters in ID', async () => {
      const unicodeId = 'Categoría 🏦 カテゴリー';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(unicodeId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
    });

    it('should handle category IDs with slashes', async () => {
      const idWithSlash = 'Category/Subcategory';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(idWithSlash).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Category/Subcategory`,
      );
    });
  });
});
