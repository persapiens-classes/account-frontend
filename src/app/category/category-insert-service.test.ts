import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoryInsertService } from './category-insert-service';
import { Category, CategoryType } from './category';
import { environment } from '../../environments/environment';

describe('CategoryInsertService', () => {
  let service: CategoryInsertService;
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
    service = new CategoryInsertService(mockHttpClient, categoryType);
  });

  describe('Service Structure', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be an instance of CategoryInsertService', () => {
      expect(service).toBeInstanceOf(CategoryInsertService);
    });

    it('should have insert method', () => {
      expect(typeof service.insert).toBe('function');
    });

    it('should store http client', () => {
      expect(service['http']).toBe(mockHttpClient);
    });

    it('should store category type', () => {
      expect(service['type']).toBe(CategoryType.DEBIT);
    });
  });

  describe('insert method - DEBIT category', () => {
    it('should call HTTP POST with correct parameters', () => {
      const testCategory = new Category('Test Category');
      const expectedResponse = new Category('Test Category');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.insert(testCategory).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories`,
        testCategory,
      );
    });

    it('should return transformed Category on successful insert', async () => {
      const inputCategory = new Category('New Category');
      const mockResponse = { description: 'New Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(inputCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('New Category');
      expect(result.getId()).toBe('New Category');
    });

    it('should handle HTTP errors correctly', async () => {
      const testCategory = new Category('Test Category');
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
          service.insert(testCategory).subscribe({
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
      const testCategory = new Category('Test Category');
      const networkError = new Error('Network error');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should work with empty description', async () => {
      const emptyCategory = new Category('');
      const mockResponse = { description: '' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(emptyCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('');
      expect(result.getId()).toBe('');
    });

    it('should preserve special characters in description', async () => {
      const categoryWithSpecialChars = new Category('Category & <Special> "Characters"');
      const mockResponse = { description: 'Category & <Special> "Characters"' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(categoryWithSpecialChars).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Category & <Special> "Characters"');
    });
  });

  describe('insert method - CREDIT category', () => {
    beforeEach(() => {
      service = new CategoryInsertService(mockHttpClient, CategoryType.CREDIT);
    });

    it('should use correct URL for CREDIT category', () => {
      const testCategory = new Category('Credit Category');
      const expectedResponse = new Category('Credit Category');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.insert(testCategory).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditCategories`,
        testCategory,
      );
    });

    it('should insert CREDIT category successfully', async () => {
      const inputCategory = new Category('Revenue Category');
      const mockResponse = { description: 'Revenue Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(inputCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('Revenue Category');
    });
  });

  describe('insert method - EQUITY category', () => {
    beforeEach(() => {
      service = new CategoryInsertService(mockHttpClient, CategoryType.EQUITY);
    });

    it('should use correct URL for EQUITY category', () => {
      const testCategory = new Category('Equity Category');
      const expectedResponse = new Category('Equity Category');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.insert(testCategory).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityCategories`,
        testCategory,
      );
    });

    it('should insert EQUITY category successfully', async () => {
      const inputCategory = new Category('Capital Category');
      const mockResponse = { description: 'Capital Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(inputCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('Capital Category');
    });
  });

  describe('Error Handling', () => {
    it('should handle 500 server error', async () => {
      const testCategory = new Category('Test Category');
      const errorResponse = new HttpErrorResponse({
        error: 'Internal Server Error',
        status: 500,
        statusText: 'Internal Server Error',
      });

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 500,
      });
    });

    it('should handle validation errors', async () => {
      const testCategory = new Category('Invalid Category');
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Validation failed' },
        status: 422,
        statusText: 'Unprocessable Entity',
      });

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 422,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long descriptions', async () => {
      const longDescription = 'A'.repeat(1000);
      const categoryWithLongDesc = new Category(longDescription);
      const mockResponse = { description: longDescription };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(categoryWithLongDesc).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe(longDescription);
    });

    it('should handle Unicode characters', async () => {
      const unicodeCategory = new Category('Categoría 🏦 カテゴリー');
      const mockResponse = { description: 'Categoría 🏦 カテゴリー' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(unicodeCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Categoría 🏦 カテゴリー');
    });
  });
});
