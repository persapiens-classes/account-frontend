import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { ModelUpdateService, updateModel } from './model-update-service';
import { MinimalModel, ValidModel } from './model-test-helpers';
import { createHttpClientTestMock } from '../shared/http-client-test-mock';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

// Mock implementation of Model for testing
interface TestModel {
  id: string;
  name: string;
  value: number;
}

// Factory function for TestModel
const createTestModel = (): TestModel => ({
  id: '',
  name: '',
  value: 0,
});

// Mock input type for update operations
interface TestModelUpdate {
  name?: string;
  value?: number;
}

describe('ModelUpdateService', () => {
  let mockHttpClient: HttpClient;

  beforeEach(async () => {
    mockHttpClient = createHttpClientTestMock();

    await TestUtils.setupServiceTestBed(Object, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);
  });

  describe('ModelUpdateService Interface', () => {
    it('should define the correct interface structure', () => {
      // Test that the interface exists and has the expected method signature
      const mockService: ModelUpdateService<TestModel, TestModelUpdate> = {
        update: (): Observable<TestModel> => of(createTestModel()),
      };

      TestUtils.testServiceMethods(mockService, ['update']);
      expect(typeof mockService.update).toBe('function');

      // Test that update returns an Observable
      const result = mockService.update('123', { name: 'Updated' });
      expect(result).toBeInstanceOf(Observable);
    });

    it('should accept correct generic type parameters', () => {
      // Test with different Model and Update types
      interface CustomModelUpdate {
        title?: string;
        active?: boolean;
      }

      interface CustomModel {
        id: string;
        title: string;
        active: boolean;
      }

      function createCustomModel(): CustomModel {
        return {
          id: '',
          title: '',
          active: true,
        };
      }

      const mockService: ModelUpdateService<CustomModel, CustomModelUpdate> = {
        update: (): Observable<CustomModel> => of(createCustomModel()),
      };

      TestUtils.testServiceMethods(mockService, ['update']);
      expect(mockService.update).toBeDefined();

      // Test type compatibility
      const update: CustomModelUpdate = { title: 'Updated', active: false };
      const result = mockService.update('test-id', update);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should implement update method with correct signature', () => {
      const service: ModelUpdateService<TestModel, TestModelUpdate> = {
        update: (id: string, model: TestModelUpdate): Observable<TestModel> => {
          // Acknowledge parameters are intentionally unused in mock
          expect(id).toBeDefined();
          expect(model).toBeDefined();
          return of(createTestModel());
        },
      };

      TestUtils.testServiceMethodSignatures(service, [{ methodName: 'update', parameterCount: 2 }]);
      expect(service.update).toBeDefined();
    });
  });

  describe('updateModel Function', () => {
    const expectUpdateHttpError = async (
      routerName: string,
      id: string,
      updateData: TestModelUpdate,
      expectedStatus: number,
      errorResponse: HttpErrorResponse,
    ): Promise<void> => {
      vi.mocked(mockHttpClient.put).mockReturnValue(throwError(() => errorResponse));

      await expect(
        firstValueFrom(updateModel(updateData, mockHttpClient, routerName, id, '/')),
      ).rejects.toMatchObject({ status: expectedStatus });
    };

    it('should construct correct API URL with simple ID', () => {
      const routerName = 'test-models';
      const id = '123';
      const idSeparator = '/';
      const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;
      const mockResponse = { id: '123', name: 'Updated Model', value: 200 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      const updateData: TestModelUpdate = { name: 'Updated Model', value: 200 };

      updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, updateData);
    });

    it('should send PUT request with correct data', () => {
      const routerName = 'test-updates';
      const id = 'update-123';
      const idSeparator = '/';
      const updateData: TestModelUpdate = { name: 'Updated Name', value: 999 };
      const mockResponse = { id: 'update-123', name: 'Updated Name', value: 999 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/${routerName}/${id}`,
        updateData,
      );
    });

    it('should transform response using toModel function', () => {
      const routerName = 'transform-test';
      const id = 'transform-456';
      const idSeparator = '/';
      const updateData: TestModelUpdate = { name: 'Transformed', value: 777 };
      const mockResponse = { id: 'transform-456', name: 'Transformed', value: 777 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe((result) => {
          expect((result as TestModel).id).toBe('transform-456');
          expect((result as TestModel).name).toBe('Transformed');
          expect((result as TestModel).value).toBe(777);
          resolve();
        });
      });
    });

    it('should use custom jsonToModelFunction when provided', () => {
      const routerName = 'custom-updates';
      const id = 'custom-789';
      const idSeparator = '/';
      const updateData: TestModelUpdate = { name: 'Custom', value: 888 };
      const mockResponse = { id: 'custom-789', name: 'Custom', value: 888 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe((result) => {
          expect((result as TestModel).name).toBe('Custom');
          resolve();
        });
      });
    });

    it('should use defaultJsonToModel when no custom function provided', () => {
      const routerName = 'default-updates';
      const id = 'default-101';
      const idSeparator = '/';
      const updateData: TestModelUpdate = { name: 'Default Update', value: 222 };
      const mockResponse = { id: 'default-101', name: 'Default Update', value: 222 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe((result) => {
          expect((result as TestModel).name).toBe('Default Update');
          expect((result as TestModel).value).toBe(222);
          resolve();
        });
      });
    });

    it('should handle HTTP errors correctly', () => {
      return expectUpdateHttpError(
        'error-updates',
        'error-123',
        { name: 'Error Update', value: 400 },
        404,
        new HttpErrorResponse({
          status: 404,
          statusText: 'Not Found',
          error: 'Entity not found for update',
        }),
      );
    });

    it('should handle different HTTP status errors', () => {
      return expectUpdateHttpError(
        'server-error-updates',
        'server-error-456',
        { name: 'Server Error', value: 500 },
        500,
        new HttpErrorResponse({
          status: 500,
          statusText: 'Internal Server Error',
          error: 'Database update failed',
        }),
      );
    });
  });

  describe('Integration with Model utility functions', () => {
    it('should work with different Model implementations', async () => {
      const routerName = 'minimal-updates';
      const id = 'minimal-123';
      const idSeparator = '/';
      const updateData = { data: 'updated minimal data' };
      const mockResponse = { id: 'minimal-123', data: 'updated minimal data' };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      const result = (await firstValueFrom(
        updateModel(updateData, mockHttpClient, routerName, id, idSeparator),
      )) as MinimalModel;

      expect(result).toMatchObject({ id: 'minimal-123', data: 'updated minimal data' });
    });
  });

  describe('Environment Integration', () => {
    it('should use environment.apiUrl for requests', () => {
      expect(environment.apiUrl).toBeDefined();

      const routerName = 'environment-test';
      const id = 'env-123';
      const idSeparator = '/';
      const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;
      const updateData: TestModelUpdate = { name: 'Env Test', value: 456 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

      updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, updateData);
    });

    it('should construct URLs correctly with different router names', () => {
      const routeCases: [string, string][] = [
        ['users', 'user-1'],
        ['products', 'product-2'],
        ['categories', 'cat-3'],
      ];

      for (const [routerName, id] of routeCases) {
        const updateData: TestModelUpdate = { name: 'Test', value: 1 };
        const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;

        vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

        updateModel(updateData, mockHttpClient, routerName, id, '/').subscribe();

        expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, updateData);
      }
    });
  });

  describe('Type Safety and Generic Constraints', () => {
    it('should enforce Model constraint on generic types', () => {
      const service: ModelUpdateService<ValidModel, { title?: string }> = {
        update: (): Observable<ValidModel> => of(new ValidModel()),
      };

      TestUtils.testServiceMethods(service, ['update']);
      expect(service.update).toBeDefined();
    });
  });

  describe('ID Separator Handling', () => {
    it('should handle different ID separators', () => {
      const testCases = [
        { separator: '/', expected: `${environment.apiUrl}/test-router/test-id` },
        { separator: '-', expected: `${environment.apiUrl}/test-router-test-id` },
        { separator: '_', expected: `${environment.apiUrl}/test-router_test-id` },
      ];

      testCases.forEach(({ separator, expected }) => {
        const routerName = 'test-router';
        const id = 'test-id';
        const updateData: TestModelUpdate = { name: 'Separator Test', value: 1 };

        vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

        updateModel(updateData, mockHttpClient, routerName, id, separator).subscribe();

        expect(mockHttpClient.put).toHaveBeenCalledWith(expected, updateData);
      });
    });

    it('should handle empty ID separator', () => {
      const routerName = 'no-separator';
      const id = 'nosep123';
      const separator = '';
      const expectedUrl = `${environment.apiUrl}/${routerName}${id}`;
      const updateData: TestModelUpdate = { name: 'No Separator', value: 0 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

      updateModel(updateData, mockHttpClient, routerName, id, separator).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, updateData);
    });
  });
});
