import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoryUpdateService } from './category-update-service';
import { Category, categoryId, CategoryType } from './category';
import { createHttpClientTestMock } from '../shared/test-utils';
import { environment } from '../../environments/environment';
import { PATHS } from '../app.paths';

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

  const expectUpdatedDescription = async (
    categoryId: string,
    description: string,
  ): Promise<Category> => {
    const updatedCategory = { description };
    (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(updatedCategory));

    return new Promise<Category>((resolve, reject) => {
      service.update(categoryId, updatedCategory).subscribe({
        next: resolve,
        error: reject,
      });
    });
  };

  beforeEach(() => {
    mockHttpClient = createHttpClientTestMock();

    categoryType = CategoryType.DEBIT;
    service = new CategoryUpdateService(mockHttpClient, categoryType);
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
      const result = await expectUpdatedDescription('Original Category', 'Modified Category');

      expect(result.description).toBe('Modified Category');
      expect(categoryId(result)).toBe('Modified Category');
    });

    it('should handle HTTP errors correctly', async () => {
      await expectUpdateError(
        'Test Category',
        { description: 'Updated Category' },
        new HttpErrorResponse({
          error: 'Update failed',
          status: 400,
          statusText: 'Bad Request',
        }),
      );
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
      const result = await expectUpdatedDescription(
        'Original Category',
        'Category & <Special> "Characters"',
      );

      expect(result.description).toBe('Category & <Special> "Characters"');
    });

    it('should handle empty description', async () => {
      const result = await expectUpdatedDescription('Original Category', '');

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

  describe('update method - non-debit categories', () => {
    it.each([
      {
        type: CategoryType.CREDIT,
        prefix: 'credit',
        requestId: 'Old Credit Category',
        requestDescription: 'New Credit Category',
        successId: 'Revenue',
        successDescription: 'Sales Revenue',
      },
      {
        type: CategoryType.EQUITY,
        prefix: 'equity',
        requestId: 'Old Equity Category',
        requestDescription: 'New Equity Category',
        successId: 'Capital',
        successDescription: 'Share Capital',
      },
    ])('should support $type update flow', async (scenario) => {
      const typedService = new CategoryUpdateService(mockHttpClient, scenario.type);
      const requestPayload = { description: scenario.requestDescription };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(requestPayload));
      typedService.update(scenario.requestId, requestPayload).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/${scenario.prefix}${PATHS.CATEGORY_PATH}/${scenario.requestId}`,
        requestPayload,
      );

      const successPayload = { description: scenario.successDescription };
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(successPayload));
      const result = await new Promise<Category>((resolve, reject) => {
        typedService.update(scenario.successId, successPayload).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe(scenario.successDescription);
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
