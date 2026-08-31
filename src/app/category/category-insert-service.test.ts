import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoryInsertService } from './category-insert-service';
import { Category, categoryId, CategoryType } from './category';
import { environment } from '../../environments/environment';
import { PATHS } from '../app.paths';

describe('CategoryInsertService', () => {
  let service: CategoryInsertService;
  let mockHttpClient: HttpClient;
  let categoryType: CategoryType;

  const expectInsertError = async (
    testCategory: { description: string },
    errorResponse: HttpErrorResponse,
  ): Promise<void> => {
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
      status: errorResponse.status,
    });
  };

  const expectInsertedDescription = async (description: string): Promise<void> => {
    const payload = { description };
    (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(payload));

    const result = await new Promise<Category>((resolve, reject) => {
      service.insert(payload).subscribe({ next: resolve, error: reject });
    });

    expect(result.description).toBe(description);
  };

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

  describe('insert method - DEBIT category', () => {
    it('should call HTTP POST with correct parameters', () => {
      const testCategory = { description: 'Test Category' };
      const expectedResponse = { description: 'Test Category' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.insert(testCategory).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/debit${PATHS.CATEGORY_PATH}`,
        testCategory,
      );
    });

    it('should return transformed Category on successful insert', async () => {
      await expectInsertedDescription('New Category');
      expect(categoryId({ description: 'New Category' } as Category)).toBe('New Category');
    });

    it('should handle HTTP errors correctly', async () => {
      await expectInsertError(
        { description: 'Test Category' },
        new HttpErrorResponse({
          error: 'Insert failed',
          status: 400,
          statusText: 'Bad Request',
        }),
      );
    });

    it('should handle network errors', async () => {
      const testCategory = { description: 'Test Category' };
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
      const emptyCategory = { description: '' };
      const mockResponse = { description: '' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Category>((resolve, reject) => {
        service.insert(emptyCategory).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.description).toBe('');
      expect(categoryId(result)).toBe('');
    });

    it('should preserve special characters in description', async () => {
      const categoryWithSpecialChars = { description: 'Category & <Special> "Characters"' };
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
    it.each([
      {
        type: CategoryType.CREDIT,
        routePrefix: 'credit',
        requestDescription: 'Credit Category',
        successDescription: 'Revenue Category',
      },
      {
        type: CategoryType.EQUITY,
        routePrefix: 'equity',
        requestDescription: 'Equity Category',
        successDescription: 'Capital Category',
      },
    ])('should support $type category flow', async (scenario) => {
      const typedService = new CategoryInsertService(mockHttpClient, scenario.type);
      const urlCategory = { description: scenario.requestDescription };
      const successCategory = { description: scenario.successDescription };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(urlCategory));
      typedService.insert(urlCategory).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/${scenario.routePrefix}${PATHS.CATEGORY_PATH}`,
        urlCategory,
      );

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(successCategory));
      const result = await new Promise<Category>((resolve, reject) => {
        typedService.insert(successCategory).subscribe({ next: resolve, error: reject });
      });

      expect(result.description).toBe(scenario.successDescription);
    });
  });

  describe('Error Handling', () => {
    it('should handle 500 server error', async () => {
      await expectInsertError(
        { description: 'Test Category' },
        new HttpErrorResponse({
          error: 'Internal Server Error',
          status: 500,
          statusText: 'Internal Server Error',
        }),
      );
    });

    it('should handle validation errors', async () => {
      await expectInsertError(
        { description: 'Invalid Category' },
        new HttpErrorResponse({
          error: { message: 'Validation failed' },
          status: 422,
          statusText: 'Unprocessable Entity',
        }),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long descriptions', async () => {
      const longDescription = 'A'.repeat(1000);
      const categoryWithLongDesc = { description: longDescription };
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
      const unicodeCategory = { description: 'Categoría 🏦 カテゴリー' };
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
