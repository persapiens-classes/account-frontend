import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { expect, vi, describe, it, beforeEach } from 'vitest';
import { ModelInsertService, insertModel } from './model-insert-service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

// Mock implementation of Model for testing
interface TestModel {
  id: string;
  name: string;
  value: number;
}

// Factory function for TestModel
const createTestModel = (): TestModel => {
  return { id: '', name: '', value: 0 };
};

// Mock input type for insert operations
interface TestModelInput {
  name: string;
  value: number;
}

describe('ModelInsertService', () => {
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

  describe('ModelInsertService Interface', () => {
    it('should define the correct interface structure', () => {
      // Test that the interface exists and has the expected method signature
      const mockService: ModelInsertService<TestModel, TestModelInput> = {
        insert: (): Observable<TestModel> => of(createTestModel()),
      };

      TestUtils.testServiceMethods(mockService, ['insert']);
      expect(typeof mockService.insert).toBe('function');

      // Test that insert returns an Observable
      const result = mockService.insert({ name: 'Test', value: 42 });
      expect(result).toBeInstanceOf(Observable);
    });

    it('should accept correct generic type parameters', () => {
      // Test with different Model and Input types
      interface CustomModelInput {
        title: string;
        active: boolean;
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

      const mockService: ModelInsertService<CustomModel, CustomModelInput> = {
        insert: (): Observable<CustomModel> => of(createCustomModel()),
      };

      TestUtils.testServiceMethods(mockService, ['insert']);
      expect(mockService.insert).toBeDefined();

      // Test type compatibility
      const input: CustomModelInput = { title: 'Test', active: true };
      const result = mockService.insert(input);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should implement insert method with correct signature', () => {
      const service: ModelInsertService<TestModel, TestModelInput> = {
        insert: (model: TestModelInput): Observable<TestModel> => {
          // Acknowledge parameter is intentionally unused in mock
          expect(model).toBeDefined();
          return of(createTestModel());
        },
      };

      TestUtils.testServiceMethodSignatures(service, [{ methodName: 'insert', parameterCount: 1 }]);
      expect(service.insert).toBeDefined();
    });
  });

  describe('insertModel Function', () => {
    it('should construct correct API URL', () => {
      const routerName = 'test-models';
      const expectedUrl = `${environment.apiUrl}/${routerName}`;
      const mockResponse = { id: '1', name: 'Test Model', value: 42 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      const inputModel: TestModelInput = { name: 'Test Model', value: 42 };

      insertModel(inputModel, mockHttpClient, routerName).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, inputModel);
    });

    it('should send POST request with correct data', () => {
      const routerName = 'owners';
      const inputModel: TestModelInput = { name: 'John Doe', value: 100 };
      const mockResponse = { id: '123', name: 'John Doe', value: 100 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      insertModel(inputModel, mockHttpClient, routerName).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/${routerName}`,
        inputModel,
      );
    });

    it('should transform response using toModel function', async () => {
      const routerName = 'test-entities';
      const inputModel: TestModelInput = { name: 'Entity', value: 50 };
      const mockResponse = { id: '456', name: 'Entity', value: 50 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        insertModel(inputModel, mockHttpClient, routerName).subscribe((result) => {
          expect((result as TestModel).id).toBe('456');
          expect((result as TestModel).name).toBe('Entity');
          expect((result as TestModel).value).toBe(50);
          resolve();
        });
      });
    });

    it('should use defaultJsonToModel when no custom function provided', () => {
      const routerName = 'default-models';
      const inputModel: TestModelInput = { name: 'Default', value: 75 };
      const mockResponse = { id: '101', name: 'Default', value: 75 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        insertModel(inputModel, mockHttpClient, routerName).subscribe((result) => {
          expect((result as TestModel).name).toBe('Default');
          expect((result as TestModel).value).toBe(75);
          resolve();
        });
      });
    });

    it('should handle HTTP errors correctly', () => {
      const routerName = 'error-models';
      const inputModel: TestModelInput = { name: 'Error', value: 0 };
      const httpError = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: 'Invalid input data',
      });

      vi.mocked(mockHttpClient.post).mockReturnValue(throwError(() => httpError));

      return new Promise<void>((resolve) => {
        insertModel(inputModel, mockHttpClient, routerName).subscribe({
          next: () => {
            throw new Error('Should not reach success handler');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(HttpErrorResponse);
            expect(error.status).toBe(400);
            expect(error.statusText).toBe('Bad Request');
            resolve();
          },
        });
      });
    });

    it('should handle different HTTP status errors', () => {
      const routerName = 'server-error-models';
      const inputModel: TestModelInput = { name: 'Server Error', value: 500 };
      const serverError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Database connection failed',
      });

      vi.mocked(mockHttpClient.post).mockReturnValue(throwError(() => serverError));

      return new Promise<void>((resolve) => {
        insertModel(inputModel, mockHttpClient, routerName).subscribe({
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

      const routerName = 'minimal-models';
      const inputData = { data: 'minimal data' };
      const mockResponse = { id: 'min-1', data: 'minimal data' };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        insertModel(inputData, mockHttpClient, routerName).subscribe((result) => {
          expect((result as MinimalModel).id).toBe('min-1');
          expect((result as MinimalModel).data).toBe('minimal data');
          resolve();
        });
      });
    });
  });

  describe('Environment Integration', () => {
    it('should use environment.apiUrl for requests', () => {
      expect(environment.apiUrl).toBeDefined();

      const routerName = 'environment-test';
      const expectedUrl = `${environment.apiUrl}/${routerName}`;
      const inputModel: TestModelInput = { name: 'Env Test', value: 123 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of({}));

      insertModel(inputModel, mockHttpClient, routerName).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, inputModel);
    });

    it('should construct URLs correctly with different router names', () => {
      const testCases = [
        { routerName: 'users', expected: `${environment.apiUrl}/users` },
        { routerName: 'products', expected: `${environment.apiUrl}/products` },
        { routerName: 'categories', expected: `${environment.apiUrl}/categories` },
      ];

      testCases.forEach(({ routerName, expected }) => {
        const inputModel: TestModelInput = { name: 'Test', value: 1 };
        vi.mocked(mockHttpClient.post).mockReturnValue(of({}));

        insertModel(inputModel, mockHttpClient, routerName).subscribe();

        expect(mockHttpClient.post).toHaveBeenCalledWith(expected, inputModel);
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

      const service: ModelInsertService<ValidModel, { title: string }> = {
        insert: (): Observable<ValidModel> => of(new ValidModel()),
      };

      TestUtils.testServiceMethods(service, ['insert']);
      expect(service.insert).toBeDefined();
    });

    it('should handle Observable streams correctly', () => {
      const routerName = 'stream-test';
      const inputModel: TestModelInput = { name: 'Stream', value: 999 };
      const mockResponse = { id: 'stream-1', name: 'Stream', value: 999 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      const result$ = insertModel(inputModel, mockHttpClient, routerName);

      expect(result$).toBeInstanceOf(Observable);

      return new Promise<void>((resolve, reject) => {
        result$.subscribe({
          next: (model) => {
            const typedModel = model as TestModel;
            expect(typedModel.id).toBe('stream-1');
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle network timeout errors', () => {
      const routerName = 'timeout-test';
      const inputModel: TestModelInput = { name: 'Timeout', value: 408 };
      const timeoutError = new HttpErrorResponse({
        status: 408,
        statusText: 'Request Timeout',
        error: 'Request timed out',
      });

      vi.mocked(mockHttpClient.post).mockReturnValue(throwError(() => timeoutError));

      return new Promise<void>((resolve) => {
        insertModel(inputModel, mockHttpClient, routerName).subscribe({
          next: () => {
            throw new Error('Should not reach success handler');
          },
          error: (error) => {
            expect(error.status).toBe(408);
            expect(error.statusText).toBe('Request Timeout');
            resolve();
          },
        });
      });
    });
  });

  describe('Service Architecture Patterns', () => {
    it('should support dependency injection pattern', () => {
      // Test that HttpClient can be injected and configured
      expect(mockHttpClient).toBeDefined();
      TestUtils.testServiceMethods(mockHttpClient, ['post']);
    });

    it('should support factory function pattern', () => {
      const factory = createTestModel;
      expect(typeof factory).toBe('function');

      const model = factory();
      expect(model.id).toBe('');
    });

    it('should support transformation function pattern', () => {
      const customTransform = (model: TestModel): TestModel => {
        model.name = model.name.toUpperCase();
        return model;
      };

      const testModel = { id: '1', name: 'test', value: 100 };
      const transformed = customTransform(testModel);

      expect(transformed.name).toBe('TEST');
      expect(transformed).toBe(testModel); // Same reference
    });

    it('should support service composition', () => {
      const service1: ModelInsertService<TestModel, TestModelInput> = {
        insert: (model: TestModelInput): Observable<TestModel> =>
          of({ id: '1', name: model.name, value: model.value }),
      };

      const service2: ModelInsertService<TestModel, TestModelInput> = {
        insert: (model: TestModelInput): Observable<TestModel> =>
          of({ id: '2', name: model.name, value: model.value }),
      };

      // Test that services can be composed
      const input: TestModelInput = { name: 'Composed', value: 500 };

      return new Promise<void>((resolve) => {
        service1.insert(input).subscribe((result1) => {
          service2.insert(input).subscribe((result2) => {
            expect(result1.id).toBe('1');
            expect(result2.id).toBe('2');
            expect(result1.name).toBe(result2.name);
            resolve();
          });
        });
      });
    });
  });

  describe('Performance and Efficiency', () => {
    it('should handle multiple concurrent requests', () => {
      const routerName = 'concurrent-test';
      const requests = Array.from({ length: 5 }, (_, i) => ({
        name: `Concurrent ${i}`,
        value: i * 10,
      }));

      const mockResponses = requests.map((req, i) => ({
        id: `concurrent-${i}`,
        name: req.name,
        value: req.value,
      }));

      mockResponses.forEach((response) => {
        vi.mocked(mockHttpClient.post).mockReturnValueOnce(of(response));
      });

      const insertObservables = requests.map((request) =>
        insertModel(request, mockHttpClient, routerName),
      );

      return new Promise<void>((resolve) => {
        let completedCount = 0;
        const results: TestModel[] = [];

        insertObservables.forEach((observable) => {
          observable.subscribe((result) => {
            results.push(result as TestModel);
            completedCount++;
            if (completedCount === requests.length) {
              expect(results).toHaveLength(5);
              results.forEach((resultItem, i) => {
                expect(resultItem.id).toBe(`concurrent-${i}`);
              });
              resolve();
            }
          });
        });
      });
    });

    it('should maintain performance with large data objects', () => {
      const routerName = 'large-data-test';
      const largeData = {
        name: 'Large Object',
        value: 1000,
        metadata: Array.from({ length: 1000 }, (_, i) => `data-${i}`).join(','),
      };

      const mockResponse = {
        id: 'large-1',
        ...largeData,
      };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      const startTime = performance.now();

      return new Promise<void>((resolve) => {
        insertModel(largeData, mockHttpClient, routerName).subscribe(() => {
          const endTime = performance.now();
          const duration = endTime - startTime;

          expect(duration).toBeLessThan(100); // Should complete quickly
          resolve();
        });
      });
    });
  });
});
