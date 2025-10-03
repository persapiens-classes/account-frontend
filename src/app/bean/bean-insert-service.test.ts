import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { expect, vi, describe, it, beforeEach } from 'vitest';
import { BeanInsertService, insertBean } from './bean-insert-service';
import { Bean, toBean, defaultJsonToBean } from './bean';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

// Mock implementation of Bean for testing
class TestBean implements Bean {
  constructor(
    public id = '',
    public name = '',
    public value = 0,
  ) {}

  getId(): string {
    return this.id;
  }
}

// Factory function for TestBean
const createTestBean = (): TestBean => new TestBean();

// Mock input type for insert operations
interface TestBeanInput {
  name: string;
  value: number;
}

describe('BeanInsertService', () => {
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

  describe('BeanInsertService Interface', () => {
    it('should define the correct interface structure', () => {
      // Test that the interface exists and has the expected method signature
      const mockService: BeanInsertService<TestBean, TestBeanInput> = {
        insert: (): Observable<TestBean> => of(new TestBean()),
      };

      TestUtils.testServiceMethods(mockService, ['insert']);
      expect(typeof mockService.insert).toBe('function');

      // Test that insert returns an Observable
      const result = mockService.insert({ name: 'Test', value: 42 });
      expect(result).toBeInstanceOf(Observable);
    });

    it('should accept correct generic type parameters', () => {
      // Test with different Bean and Input types
      interface CustomBeanInput {
        title: string;
        active: boolean;
      }

      class CustomBean implements Bean {
        constructor(
          public id = '',
          public title = '',
          public active = true,
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const mockService: BeanInsertService<CustomBean, CustomBeanInput> = {
        insert: (): Observable<CustomBean> => of(new CustomBean()),
      };

      TestUtils.testServiceMethods(mockService, ['insert']);
      expect(mockService.insert).toBeDefined();

      // Test type compatibility
      const input: CustomBeanInput = { title: 'Test', active: true };
      const result = mockService.insert(input);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should implement insert method with correct signature', () => {
      const service: BeanInsertService<TestBean, TestBeanInput> = {
        insert: (bean: TestBeanInput): Observable<TestBean> => {
          // Acknowledge parameter is intentionally unused in mock
          expect(bean).toBeDefined();
          return of(new TestBean());
        },
      };

      TestUtils.testServiceMethodSignatures(service, [{ methodName: 'insert', parameterCount: 1 }]);
      expect(service.insert).toBeDefined();
    });
  });

  describe('insertBean Function', () => {
    it('should construct correct API URL', () => {
      const routerName = 'test-beans';
      const expectedUrl = `${environment.apiUrl}/${routerName}`;
      const mockResponse = { id: '1', name: 'Test Bean', value: 42 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      const inputBean: TestBeanInput = { name: 'Test Bean', value: 42 };

      insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, inputBean);
    });

    it('should send POST request with correct data', () => {
      const routerName = 'owners';
      const inputBean: TestBeanInput = { name: 'John Doe', value: 100 };
      const mockResponse = { id: '123', name: 'John Doe', value: 100 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        `${environment.apiUrl}/${routerName}`,
        inputBean,
      );
    });

    it('should transform response using toBean function', async () => {
      const routerName = 'test-entities';
      const inputBean: TestBeanInput = { name: 'Entity', value: 50 };
      const mockResponse = { id: '456', name: 'Entity', value: 50 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          expect(result.getId()).toBe('456');
          expect(result.name).toBe('Entity');
          expect(result.value).toBe(50);
          resolve();
        });
      });
    });

    it('should use custom jsonToBeanFunction when provided', () => {
      const customJsonToBean = vi.fn((bean: TestBean): TestBean => {
        bean.name = `Inserted ${bean.name}`;
        return bean;
      });

      const routerName = 'custom-beans';
      const inputBean: TestBeanInput = { name: 'Custom', value: 25 };
      const mockResponse = { id: '789', name: 'Custom', value: 25 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        insertBean(
          inputBean,
          mockHttpClient,
          routerName,
          createTestBean,
          customJsonToBean,
        ).subscribe((result) => {
          expect(customJsonToBean).toHaveBeenCalled();
          expect(result.name).toBe('Inserted Custom');
          resolve();
        });
      });
    });

    it('should use defaultJsonToBean when no custom function provided', () => {
      const routerName = 'default-beans';
      const inputBean: TestBeanInput = { name: 'Default', value: 75 };
      const mockResponse = { id: '101', name: 'Default', value: 75 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          expect(result.name).toBe('Default');
          expect(result.value).toBe(75);
          resolve();
        });
      });
    });

    it('should handle HTTP errors correctly', () => {
      const routerName = 'error-beans';
      const inputBean: TestBeanInput = { name: 'Error', value: 0 };
      const httpError = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: 'Invalid input data',
      });

      vi.mocked(mockHttpClient.post).mockReturnValue(throwError(() => httpError));

      return new Promise<void>((resolve) => {
        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe({
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
      const routerName = 'server-error-beans';
      const inputBean: TestBeanInput = { name: 'Server Error', value: 500 };
      const serverError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Database connection failed',
      });

      vi.mocked(mockHttpClient.post).mockReturnValue(throwError(() => serverError));

      return new Promise<void>((resolve) => {
        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe({
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

  describe('Integration with Bean utility functions', () => {
    it('should work with toBean function', () => {
      const jsonData = { id: '1', name: 'Integration Test', value: 200 };
      const bean = toBean(jsonData, createTestBean, defaultJsonToBean);

      expect(bean).toBeInstanceOf(TestBean);
      expect(bean.getId()).toBe('1');
      expect(bean.name).toBe('Integration Test');
      expect(bean.value).toBe(200);
    });

    it('should work with different Bean implementations', () => {
      class MinimalBean implements Bean {
        constructor(
          public id = '',
          public data = '',
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const createMinimalBean = (): MinimalBean => new MinimalBean();
      const routerName = 'minimal-beans';
      const inputData = { data: 'minimal data' };
      const mockResponse = { id: 'min-1', data: 'minimal data' };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        insertBean(inputData, mockHttpClient, routerName, createMinimalBean).subscribe((result) => {
          expect(result).toBeInstanceOf(MinimalBean);
          expect(result.getId()).toBe('min-1');
          expect(result.data).toBe('minimal data');
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
      const inputBean: TestBeanInput = { name: 'Env Test', value: 123 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of({}));

      insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, inputBean);
    });

    it('should construct URLs correctly with different router names', () => {
      const testCases = [
        { routerName: 'users', expected: `${environment.apiUrl}/users` },
        { routerName: 'products', expected: `${environment.apiUrl}/products` },
        { routerName: 'categories', expected: `${environment.apiUrl}/categories` },
      ];

      testCases.forEach(({ routerName, expected }) => {
        const inputBean: TestBeanInput = { name: 'Test', value: 1 };
        vi.mocked(mockHttpClient.post).mockReturnValue(of({}));

        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe();

        expect(mockHttpClient.post).toHaveBeenCalledWith(expected, inputBean);
      });
    });
  });

  describe('Type Safety and Generic Constraints', () => {
    it('should enforce Bean constraint on generic types', () => {
      interface ValidBeanType extends Bean {
        title: string;
      }

      class ValidBean implements ValidBeanType {
        constructor(
          public id = '',
          public title = '',
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const service: BeanInsertService<ValidBean, { title: string }> = {
        insert: (): Observable<ValidBean> => of(new ValidBean()),
      };

      TestUtils.testServiceMethods(service, ['insert']);
      expect(service.insert).toBeDefined();
    });

    it('should handle Observable streams correctly', () => {
      const routerName = 'stream-test';
      const inputBean: TestBeanInput = { name: 'Stream', value: 999 };
      const mockResponse = { id: 'stream-1', name: 'Stream', value: 999 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(mockResponse));

      const result$ = insertBean(inputBean, mockHttpClient, routerName, createTestBean);

      expect(result$).toBeInstanceOf(Observable);

      return new Promise<void>((resolve, reject) => {
        result$.subscribe({
          next: (bean) => {
            expect(bean).toBeInstanceOf(TestBean);
            expect(bean.getId()).toBe('stream-1');
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
      const inputBean: TestBeanInput = { name: 'Timeout', value: 408 };
      const timeoutError = new HttpErrorResponse({
        status: 408,
        statusText: 'Request Timeout',
        error: 'Request timed out',
      });

      vi.mocked(mockHttpClient.post).mockReturnValue(throwError(() => timeoutError));

      return new Promise<void>((resolve) => {
        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe({
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

    it('should handle malformed response data', () => {
      const routerName = 'malformed-test';
      const inputBean: TestBeanInput = { name: 'Malformed', value: 400 };
      const malformedResponse = 'invalid json response';

      vi.mocked(mockHttpClient.post).mockReturnValue(of(malformedResponse));

      return new Promise<void>((resolve) => {
        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe((result) => {
          // toBean should handle malformed data gracefully
          expect(result).toBeInstanceOf(TestBean);
          resolve();
        });
      });
    });

    it('should handle null response data', () => {
      const routerName = 'null-test';
      const inputBean: TestBeanInput = { name: 'Null', value: 0 };

      vi.mocked(mockHttpClient.post).mockReturnValue(of(null));

      return new Promise<void>((resolve) => {
        insertBean(inputBean, mockHttpClient, routerName, createTestBean).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          resolve();
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
      const factory = createTestBean;
      expect(typeof factory).toBe('function');

      const bean = factory();
      expect(bean).toBeInstanceOf(TestBean);
      expect(bean.getId()).toBe('');
    });

    it('should support transformation function pattern', () => {
      const customTransform = (bean: TestBean): TestBean => {
        bean.name = bean.name.toUpperCase();
        return bean;
      };

      const testBean = new TestBean('1', 'test', 100);
      const transformed = customTransform(testBean);

      expect(transformed.name).toBe('TEST');
      expect(transformed).toBe(testBean); // Same reference
    });

    it('should support service composition', () => {
      const service1: BeanInsertService<TestBean, TestBeanInput> = {
        insert: (bean: TestBeanInput): Observable<TestBean> =>
          of(new TestBean('1', bean.name, bean.value)),
      };

      const service2: BeanInsertService<TestBean, TestBeanInput> = {
        insert: (bean: TestBeanInput): Observable<TestBean> =>
          of(new TestBean('2', bean.name, bean.value)),
      };

      // Test that services can be composed
      const input: TestBeanInput = { name: 'Composed', value: 500 };

      return new Promise<void>((resolve) => {
        service1.insert(input).subscribe((result1) => {
          service2.insert(input).subscribe((result2) => {
            expect(result1.getId()).toBe('1');
            expect(result2.getId()).toBe('2');
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
        insertBean(request, mockHttpClient, routerName, createTestBean),
      );

      return new Promise<void>((resolve) => {
        let completedCount = 0;
        const results: TestBean[] = [];

        insertObservables.forEach((observable) => {
          observable.subscribe((result) => {
            results.push(result);
            completedCount++;
            if (completedCount === requests.length) {
              expect(results).toHaveLength(5);
              results.forEach((resultItem, i) => {
                expect(resultItem.getId()).toBe(`concurrent-${i}`);
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
        insertBean(largeData, mockHttpClient, routerName, createTestBean).subscribe((result) => {
          const endTime = performance.now();
          const duration = endTime - startTime;

          expect(result).toBeInstanceOf(TestBean);
          expect(duration).toBeLessThan(100); // Should complete quickly
          resolve();
        });
      });
    });
  });
});
