import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoryUpdateService } from './category-update-service';
import { Category, CategoryType } from './category';
import { environment } from '../../environments/environment';

describe('CategoryUpdateService', () => {
  let service: CategoryUpdateService;
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
    service = new CategoryUpdateService(mockHttpClient, categoryType);
  });

  describe('Service Structure', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be an instance of CategoryUpdateService', () => {
      expect(service).toBeInstanceOf(CategoryUpdateService);
    });

    it('should have update method', () => {
      expect(typeof service.update).toBe('function');
    });

    it('should store http client', () => {
      expect(service['http']).toBe(mockHttpClient);
    });

    it('should store category type', () => {
      expect(service['type']).toBe(CategoryType.DEBIT);
    });
  });

  describe('update method - DEBIT category', () => {
    it('should call HTTP PUT with correct parameters', () => {
      const categoryId = 'Old Category';
      const updatedCategory = new Category('Updated Category');
      const expectedResponse = new Category('Updated Category');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(categoryId, updatedCategory).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Old Category`,
        updatedCategory,
      );
    });

    it('should return transformed Category on successful update', async () => {
      const categoryId = 'Original Category';
      const updatedCategory = new Category('Modified Category');
      const mockResponse = { description: 'Modified Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('Modified Category');
      expect(result.getId()).toBe('Modified Category');
    });

    it('should handle HTTP errors correctly', async () => {
      const categoryId = 'Test Category';
      const updatedCategory = new Category('Updated Category');
      const errorResponse = new HttpErrorResponse({
        error: 'Update failed',
        status: 400,
        statusText: 'Bad Request',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(categoryId, updatedCategory).subscribe({
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
      const categoryId = 'Test Category';
      const updatedCategory = new Category('Updated Category');
      const networkError = new Error('Network error');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(categoryId, updatedCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should preserve special characters in description', async () => {
      const categoryId = 'Original Category';
      const categoryWithSpecialChars = new Category('Category & <Special> "Characters"');
      const mockResponse = { description: 'Category & <Special> "Characters"' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, categoryWithSpecialChars).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Category & <Special> "Characters"');
    });

    it('should handle empty description', async () => {
      const categoryId = 'Original Category';
      const emptyCategory = new Category('');
      const mockResponse = { description: '' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, emptyCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('');
    });

    it('should handle special characters in category ID', async () => {
      const categoryId = 'Category & <Special>';
      const updatedCategory = new Category('New Description');
      const mockResponse = { description: 'New Description' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('New Description');
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Category & <Special>`,
        updatedCategory,
      );
    });
  });

  describe('update method - CREDIT category', () => {
    beforeEach(() => {
      service = new CategoryUpdateService(mockHttpClient, CategoryType.CREDIT);
    });

    it('should use correct URL for CREDIT category', () => {
      const categoryId = 'Old Credit Category';
      const updatedCategory = new Category('New Credit Category');
      const expectedResponse = new Category('New Credit Category');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(categoryId, updatedCategory).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditCategories/Old Credit Category`,
        updatedCategory,
      );
    });

    it('should update CREDIT category successfully', async () => {
      const categoryId = 'Revenue';
      const updatedCategory = new Category('Sales Revenue');
      const mockResponse = { description: 'Sales Revenue' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('Sales Revenue');
    });
  });

  describe('update method - EQUITY category', () => {
    beforeEach(() => {
      service = new CategoryUpdateService(mockHttpClient, CategoryType.EQUITY);
    });

    it('should use correct URL for EQUITY category', () => {
      const categoryId = 'Old Equity Category';
      const updatedCategory = new Category('New Equity Category');
      const expectedResponse = new Category('New Equity Category');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(categoryId, updatedCategory).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityCategories/Old Equity Category`,
        updatedCategory,
      );
    });

    it('should update EQUITY category successfully', async () => {
      const categoryId = 'Capital';
      const updatedCategory = new Category('Share Capital');
      const mockResponse = { description: 'Share Capital' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Category);
      expect(result.description).toBe('Share Capital');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 not found error', async () => {
      const categoryId = 'Non-existent Category';
      const updatedCategory = new Category('Updated Category');
      const errorResponse = new HttpErrorResponse({
        error: 'Category not found',
        status: 404,
        statusText: 'Not Found',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(categoryId, updatedCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    it('should handle 500 server error', async () => {
      const categoryId = 'Test Category';
      const updatedCategory = new Category('Updated Category');
      const errorResponse = new HttpErrorResponse({
        error: 'Internal Server Error',
        status: 500,
        statusText: 'Internal Server Error',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(categoryId, updatedCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 500,
      });
    });

    it('should handle validation errors', async () => {
      const categoryId = 'Test Category';
      const invalidCategory = new Category('Invalid');
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Validation failed' },
        status: 422,
        statusText: 'Unprocessable Entity',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(categoryId, invalidCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 422,
      });
    });

    it('should handle 409 conflict error (duplicate category)', async () => {
      const categoryId = 'Original Category';
      const updatedCategory = new Category('Duplicate Category');
      const errorResponse = new HttpErrorResponse({
        error: { message: 'Category already exists' },
        status: 409,
        statusText: 'Conflict',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(categoryId, updatedCategory).subscribe({
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
    it('should handle very long descriptions', async () => {
      const categoryId = 'Short Category';
      const longDescription = 'A'.repeat(1000);
      const categoryWithLongDesc = new Category(longDescription);
      const mockResponse = { description: longDescription };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, categoryWithLongDesc).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe(longDescription);
    });

    it('should handle Unicode characters', async () => {
      const categoryId = 'Original';
      const unicodeCategory = new Category('Categoría 🏦 カテゴリー');
      const mockResponse = { description: 'Categoría 🏦 カテゴリー' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, unicodeCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Categoría 🏦 カテゴリー');
    });

    it('should handle whitespace in descriptions', async () => {
      const categoryId = 'Original Category';
      const categoryWithWhitespace = new Category('  Category With Spaces  ');
      const mockResponse = { description: '  Category With Spaces  ' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(categoryId, categoryWithWhitespace).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('  Category With Spaces  ');
    });
  });

  describe('Category Type Integration', () => {
    it('should work correctly with all category types', async () => {
      const categoryId = 'Test';
      const updatedCategory = new Category('Updated');
      const mockResponse = { description: 'Updated' };

      // Test DEBIT
      const debitService = new CategoryUpdateService(mockHttpClient, CategoryType.DEBIT);
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));
      await new Promise<Category>((resolve, reject) => {
        debitService.update(categoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Test`,
        updatedCategory,
      );

      // Test CREDIT
      const creditService = new CategoryUpdateService(mockHttpClient, CategoryType.CREDIT);
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));
      await new Promise<Category>((resolve, reject) => {
        creditService.update(categoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditCategories/Test`,
        updatedCategory,
      );

      // Test EQUITY
      const equityService = new CategoryUpdateService(mockHttpClient, CategoryType.EQUITY);
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));
      await new Promise<Category>((resolve, reject) => {
        equityService.update(categoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityCategories/Test`,
        updatedCategory,
      );
    });
  });
});
