import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { ModelUpdateService, updateModel } from './model-update-service';
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
    // Setup mock for HttpClient
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
      head: vi.fn(),
      options: vi.fn(),
      request: vi.fn(),
    } as unknown as HttpClient;

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
      const routerName = 'error-updates';
      const id = 'error-123';
      const idSeparator = '/';
      const updateData: TestModelUpdate = { name: 'Error Update', value: 400 };
      const httpError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: 'Entity not found for update',
      });

      vi.mocked(mockHttpClient.put).mockReturnValue(throwError(() => httpError));

      return new Promise<void>((resolve) => {
        updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe({
          next: () => {
            throw new Error('Should not reach success handler');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(HttpErrorResponse);
            expect(error.status).toBe(404);
            expect(error.statusText).toBe('Not Found');
            resolve();
          },
        });
      });
    });

    it('should handle different HTTP status errors', () => {
      const routerName = 'server-error-updates';
      const id = 'server-error-456';
      const idSeparator = '/';
      const updateData: TestModelUpdate = { name: 'Server Error', value: 500 };
      const serverError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Database update failed',
      });

      vi.mocked(mockHttpClient.put).mockReturnValue(throwError(() => serverError));

      return new Promise<void>((resolve) => {
        updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe({
          next: () => {
            throw new Error('Should not reach success handler');
          },
          error: (error) => {
            expect(error.status).toBe(500);
            expect(error.statusText).toBe('Internal Server Error');
            resolve();
          },
        });
      });
    });
  });

  describe('Integration with Model utility functions', () => {
    it('should work with different Model implementations', () => {
      interface MinimalModel {
        id: string;
        data: string;
      }

      const routerName = 'minimal-updates';
      const id = 'minimal-123';
      const idSeparator = '/';
      const updateData = { data: 'updated minimal data' };
      const mockResponse = { id: 'minimal-123', data: 'updated minimal data' };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe((result) => {
          expect((result as MinimalModel).id).toBe('minimal-123');
          expect((result as MinimalModel).data).toBe('updated minimal data');
          resolve();
        });
      });
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
      const testCases = [
        {
          routerName: 'users',
          id: 'user-1',
          expected: `${environment.apiUrl}/users/user-1`,
        },
        {
          routerName: 'products',
          id: 'product-2',
          expected: `${environment.apiUrl}/products/product-2`,
        },
        {
          routerName: 'categories',
          id: 'cat-3',
          expected: `${environment.apiUrl}/categories/cat-3`,
        },
      ];

      testCases.forEach(({ routerName, id, expected }) => {
        const updateData: TestModelUpdate = { name: 'Test', value: 1 };
        const idSeparator = '/';
        vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

        updateModel(updateData, mockHttpClient, routerName, id, idSeparator).subscribe();

        expect(mockHttpClient.put).toHaveBeenCalledWith(expected, updateData);
      });
    });
  });

  describe('Type Safety and Generic Constraints', () => {
    it('should enforce Model constraint on generic types', () => {
      interface ValidModelType {
        title: string;
      }

      class ValidModel implements ValidModelType {
        constructor(
          public id = '',
          public title = '',
        ) {}

        getId(): string {
          return this.id;
        }
      }

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
