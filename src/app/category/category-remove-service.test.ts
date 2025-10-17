import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoryRemoveService } from './category-remove-service';
import { CategoryType } from './category';
import { environment } from '../../environments/environment';

describe('CategoryRemoveService', () => {
  let service: CategoryRemoveService;
  let mockHttpClient: HttpClient;
  let categoryType: CategoryType;

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as HttpClient;

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

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(categoryId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Category to Remove`,
      );
    });

    it('should handle HTTP errors correctly', async () => {
      const categoryId = 'Test Category';
      const errorResponse = new HttpErrorResponse({
        error: 'Delete failed',
        status: 404,
        statusText: 'Not Found',
      });

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
        status: 404,
        statusText: 'Not Found',
      });
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

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(categoryId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Category & <Special> "Characters"`,
      );
    });

    it('should handle empty category ID', async () => {
      const categoryId = '';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(categoryId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
      expect(mockHttpClient.delete).toHaveBeenCalledWith(`${environment.apiUrl}/debitCategories/`);
    });
  });

  describe('remove method - CREDIT category', () => {
    beforeEach(() => {
      service = new CategoryRemoveService(mockHttpClient, CategoryType.CREDIT);
    });

    it('should use correct URL for CREDIT category', () => {
      const categoryId = 'Credit Category';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      service.remove(categoryId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditCategories/Credit Category`,
      );
    });

    it('should remove CREDIT category successfully', async () => {
      const categoryId = 'Revenue Category';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(categoryId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
    });
  });

  describe('remove method - EQUITY category', () => {
    beforeEach(() => {
      service = new CategoryRemoveService(mockHttpClient, CategoryType.EQUITY);
    });

    it('should use correct URL for EQUITY category', () => {
      const categoryId = 'Equity Category';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      service.remove(categoryId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityCategories/Equity Category`,
      );
    });

    it('should remove EQUITY category successfully', async () => {
      const categoryId = 'Capital Category';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(categoryId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 403 forbidden error', async () => {
      const categoryId = 'Protected Category';
      const errorResponse = new HttpErrorResponse({
        error: 'Forbidden',
        status: 403,
        statusText: 'Forbidden',
      });

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
        status: 403,
      });
    });

    it('should handle 500 server error', async () => {
      const categoryId = 'Test Category';
      const errorResponse = new HttpErrorResponse({
        error: 'Internal Server Error',
        status: 500,
        statusText: 'Internal Server Error',
      });

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
        status: 500,
      });
    });

    it('should handle 409 conflict error (category in use)', async () => {
      const categoryId = 'Category In Use';
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Category is in use' },
        status: 409,
        statusText: 'Conflict',
      });

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
        status: 409,
      });
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
