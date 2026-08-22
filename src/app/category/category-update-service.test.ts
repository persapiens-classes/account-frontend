import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoryUpdateService } from './category-update-service';
import { Category, categoryId, CategoryType } from './category';
import { createHttpClientTestMock } from '../shared/http-client-test-mock';
import { environment } from '../../environments/environment';

describe('CategoryUpdateService', () => {
  let service: CategoryUpdateService;
  let mockHttpClient: HttpClient;
  let categoryType: CategoryType;

  const expectUpdateError = async (
    categoryId: string,
    updatedCategory: { description: string },
    errorResponse: HttpErrorResponse,
  ): Promise<void> => {
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
      status: errorResponse.status,
    });
  };

  beforeEach(() => {
    mockHttpClient = createHttpClientTestMock();

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
      const updatedCategory = { description: 'Updated Category' };
      const expectedResponse = { description: 'Updated Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(categoryId, updatedCategory).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/debitCategories/Old Category`,
        updatedCategory,
      );
    });

    it('should return transformed Category on successful update', async () => {
      const testCategoryId = 'Original Category';
      const updatedCategory = { description: 'Modified Category' };
      const mockResponse = { description: 'Modified Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Modified Category');
      expect(categoryId(result)).toBe('Modified Category');
    });

    it('should handle HTTP errors correctly', async () => {
      const testCategoryId = 'Test Category';
      const updatedCategory = { description: 'Updated Category' };
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
          service.update(testCategoryId, updatedCategory).subscribe({
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
      const testCategoryId = 'Test Category';
      const updatedCategory = { description: 'Updated Category' };
      const networkError = new Error('Network error');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(testCategoryId, updatedCategory).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should preserve special characters in description', async () => {
      const testCategoryId = 'Original Category';
      const categoryWithSpecialChars = { description: 'Category & <Special> "Characters"' };
      const mockResponse = { description: 'Category & <Special> "Characters"' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, categoryWithSpecialChars).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Category & <Special> "Characters"');
    });

    it('should handle empty description', async () => {
      const testCategoryId = 'Original Category';
      const emptyCategory = { description: '' };
      const mockResponse = { description: '' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, emptyCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('');
    });

    it('should handle special characters in category ID', async () => {
      const testCategoryId = 'Category & <Special>';
      const updatedCategory = { description: 'New Description' };
      const mockResponse = { description: 'New Description' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, updatedCategory).subscribe({
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
      const testCategoryId = 'Old Credit Category';
      const updatedCategory = { description: 'New Credit Category' };
      const expectedResponse = { description: 'New Credit Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(testCategoryId, updatedCategory).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/creditCategories/Old Credit Category`,
        updatedCategory,
      );
    });

    it('should update CREDIT category successfully', async () => {
      const testCategoryId = 'Revenue';
      const updatedCategory = { description: 'Sales Revenue' };
      const mockResponse = { description: 'Sales Revenue' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Sales Revenue');
    });
  });

  describe('update method - EQUITY category', () => {
    beforeEach(() => {
      service = new CategoryUpdateService(mockHttpClient, CategoryType.EQUITY);
    });

    it('should use correct URL for EQUITY category', () => {
      const testCategoryId = 'Old Equity Category';
      const updatedCategory = { description: 'New Equity Category' };
      const expectedResponse = { description: 'New Equity Category' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(testCategoryId, updatedCategory).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/equityCategories/Old Equity Category`,
        updatedCategory,
      );
    });

    it('should update EQUITY category successfully', async () => {
      const testCategoryId = 'Capital';
      const updatedCategory = { description: 'Share Capital' };
      const mockResponse = { description: 'Share Capital' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, updatedCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Share Capital');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 not found error', async () => {
      await expectUpdateError(
        'Non-existent Category',
        { description: 'Updated Category' },
        new HttpErrorResponse({
          error: 'Category not found',
          status: 404,
          statusText: 'Not Found',
        }),
      );
    });

    it('should handle 500 server error', async () => {
      await expectUpdateError(
        'Test Category',
        { description: 'Updated Category' },
        new HttpErrorResponse({
          error: 'Internal Server Error',
          status: 500,
          statusText: 'Internal Server Error',
        }),
      );
    });

    it('should handle validation errors', async () => {
      await expectUpdateError(
        'Test Category',
        { description: 'Invalid' },
        new HttpErrorResponse({
          error: { message: 'Validation failed' },
          status: 422,
          statusText: 'Unprocessable Entity',
        }),
      );
    });

    it('should handle 409 conflict error (duplicate category)', async () => {
      await expectUpdateError(
        'Original Category',
        { description: 'Duplicate Category' },
        new HttpErrorResponse({
          error: { message: 'Category already exists' },
          status: 409,
          statusText: 'Conflict',
        }),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long descriptions', async () => {
      const testCategoryId = 'Short Category';
      const longDescription = 'A'.repeat(1000);
      const categoryWithLongDesc = { description: longDescription };
      const mockResponse = { description: longDescription };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, categoryWithLongDesc).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe(longDescription);
    });

    it('should handle Unicode characters', async () => {
      const testCategoryId = 'Original';
      const unicodeCategory = { description: 'Categoría 🏦 カテゴリー' };
      const mockResponse = { description: 'Categoría 🏦 カテゴリー' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, unicodeCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('Categoría 🏦 カテゴリー');
    });

    it('should handle whitespace in descriptions', async () => {
      const testCategoryId = 'Original Category';
      const categoryWithWhitespace = { description: '  Category With Spaces  ' };
      const mockResponse = { description: '  Category With Spaces  ' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.update(testCategoryId, categoryWithWhitespace).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('  Category With Spaces  ');
    });
  });

  describe('Category Type Integration', () => {
    it('should work correctly with all category types', async () => {
      const testCategoryId = 'Test';
      const updatedCategory = { description: 'Updated' };
      const mockResponse = { description: 'Updated' };

      // Test DEBIT
      const debitService = new CategoryUpdateService(mockHttpClient, CategoryType.DEBIT);
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));
      await new Promise<Category>((resolve, reject) => {
        debitService.update(testCategoryId, updatedCategory).subscribe({
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
        creditService.update(testCategoryId, updatedCategory).subscribe({
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
        equityService.update(testCategoryId, updatedCategory).subscribe({
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
