import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { BeanUpdateService, updateBean } from './bean-update-service';
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

// Mock input type for update operations
interface TestBeanUpdate {
  name?: string;
  value?: number;
}

describe('BeanUpdateService', () => {
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

  describe('BeanUpdateService Interface', () => {
    it('should define the correct interface structure', () => {
      // Test that the interface exists and has the expected method signature
      const mockService: BeanUpdateService<TestBean, TestBeanUpdate> = {
        update: (): Observable<TestBean> => of(new TestBean()),
      };

      TestUtils.testServiceMethods(mockService, ['update']);
      expect(typeof mockService.update).toBe('function');

      // Test that update returns an Observable
      const result = mockService.update('123', { name: 'Updated' });
      expect(result).toBeInstanceOf(Observable);
    });

    it('should accept correct generic type parameters', () => {
      // Test with different Bean and Update types
      interface CustomBeanUpdate {
        title?: string;
        active?: boolean;
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

      const mockService: BeanUpdateService<CustomBean, CustomBeanUpdate> = {
        update: (): Observable<CustomBean> => of(new CustomBean()),
      };

      TestUtils.testServiceMethods(mockService, ['update']);
      expect(mockService.update).toBeDefined();

      // Test type compatibility
      const update: CustomBeanUpdate = { title: 'Updated', active: false };
      const result = mockService.update('test-id', update);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should implement update method with correct signature', () => {
      const service: BeanUpdateService<TestBean, TestBeanUpdate> = {
        update: (id: string, bean: TestBeanUpdate): Observable<TestBean> => {
          // Acknowledge parameters are intentionally unused in mock
          expect(id).toBeDefined();
          expect(bean).toBeDefined();
          return of(new TestBean());
        },
      };

      TestUtils.testServiceMethodSignatures(service, [{ methodName: 'update', parameterCount: 2 }]);
      expect(service.update).toBeDefined();
    });
  });

  describe('updateBean Function', () => {
    it('should construct correct API URL with simple ID', () => {
      const routerName = 'test-beans';
      const id = '123';
      const idSeparator = '/';
      const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;
      const mockResponse = { id: '123', name: 'Updated Bean', value: 200 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      const updateData: TestBeanUpdate = { name: 'Updated Bean', value: 200 };

      updateBean(
        updateData,
        mockHttpClient,
        routerName,
        id,
        idSeparator,
        createTestBean,
      ).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, updateData);
    });

    it('should send PUT request with correct data', () => {
      const routerName = 'test-updates';
      const id = 'update-123';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Updated Name', value: 999 };
      const mockResponse = { id: 'update-123', name: 'Updated Name', value: 999 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      updateBean(
        updateData,
        mockHttpClient,
        routerName,
        id,
        idSeparator,
        createTestBean,
      ).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/${routerName}/${id}`,
        updateData,
      );
    });

    it('should transform response using toBean function', () => {
      const routerName = 'transform-test';
      const id = 'transform-456';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Transformed', value: 777 };
      const mockResponse = { id: 'transform-456', name: 'Transformed', value: 777 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          expect(result.getId()).toBe('transform-456');
          expect((result as TestBean).name).toBe('Transformed');
          expect((result as TestBean).value).toBe(777);
          resolve();
        });
      });
    });

    it('should use custom jsonToBeanFunction when provided', () => {
      const customJsonToBean = vi.fn((bean: TestBean): TestBean => {
        bean.name = `Updated ${bean.name}`;
        return bean;
      });

      const routerName = 'custom-updates';
      const id = 'custom-789';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Custom', value: 888 };
      const mockResponse = { id: 'custom-789', name: 'Custom', value: 888 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
          customJsonToBean,
        ).subscribe((result) => {
          expect(customJsonToBean).toHaveBeenCalled();
          expect((result as TestBean).name).toBe('Updated Custom');
          resolve();
        });
      });
    });

    it('should use defaultJsonToBean when no custom function provided', () => {
      const routerName = 'default-updates';
      const id = 'default-101';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Default Update', value: 222 };
      const mockResponse = { id: 'default-101', name: 'Default Update', value: 222 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          expect((result as TestBean).name).toBe('Default Update');
          expect((result as TestBean).value).toBe(222);
          resolve();
        });
      });
    });

    it('should handle HTTP errors correctly', () => {
      const routerName = 'error-updates';
      const id = 'error-123';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Error Update', value: 400 };
      const httpError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: 'Entity not found for update',
      });

      vi.mocked(mockHttpClient.put).mockReturnValue(throwError(() => httpError));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe({
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
      const updateData: TestBeanUpdate = { name: 'Server Error', value: 500 };
      const serverError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Database update failed',
      });

      vi.mocked(mockHttpClient.put).mockReturnValue(throwError(() => serverError));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe({
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
      const jsonData = { id: '1', name: 'Integration Test', value: 999 };
      const bean = toBean(jsonData, createTestBean, defaultJsonToBean);

      expect(bean).toBeInstanceOf(TestBean);
      expect(bean.getId()).toBe('1');
      expect((bean as TestBean).name).toBe('Integration Test');
      expect((bean as TestBean).value).toBe(999);
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
      const routerName = 'minimal-updates';
      const id = 'minimal-123';
      const idSeparator = '/';
      const updateData = { data: 'updated minimal data' };
      const mockResponse = { id: 'minimal-123', data: 'updated minimal data' };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createMinimalBean,
        ).subscribe((result) => {
          expect(result).toBeInstanceOf(MinimalBean);
          expect(result.getId()).toBe('minimal-123');
          expect((result as MinimalBean).data).toBe('updated minimal data');
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
      const updateData: TestBeanUpdate = { name: 'Env Test', value: 456 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

      updateBean(
        updateData,
        mockHttpClient,
        routerName,
        id,
        idSeparator,
        createTestBean,
      ).subscribe();

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
        const updateData: TestBeanUpdate = { name: 'Test', value: 1 };
        const idSeparator = '/';
        vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe();

        expect(mockHttpClient.put).toHaveBeenCalledWith(expected, updateData);
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

      const service: BeanUpdateService<ValidBean, { title?: string }> = {
        update: (): Observable<ValidBean> => of(new ValidBean()),
      };

      TestUtils.testServiceMethods(service, ['update']);
      expect(service.update).toBeDefined();
    });

    it('should handle Observable streams correctly', () => {
      const routerName = 'stream-test';
      const id = 'stream-123';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Stream Update', value: 777 };
      const mockResponse = { id: 'stream-123', name: 'Stream Update', value: 777 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      const result$ = updateBean(
        updateData,
        mockHttpClient,
        routerName,
        id,
        idSeparator,
        createTestBean,
      );

      expect(result$).toBeInstanceOf(Observable);

      return new Promise<void>((resolve, reject) => {
        result$.subscribe({
          next: (bean) => {
            expect(bean).toBeInstanceOf(TestBean);
            expect(bean.getId()).toBe('stream-123');
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
      });
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
        const updateData: TestBeanUpdate = { name: 'Separator Test', value: 1 };

        vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          separator,
          createTestBean,
        ).subscribe();

        expect(mockHttpClient.put).toHaveBeenCalledWith(expected, updateData);
      });
    });

    it('should handle empty ID separator', () => {
      const routerName = 'no-separator';
      const id = 'nosep123';
      const separator = '';
      const expectedUrl = `${environment.apiUrl}/${routerName}${id}`;
      const updateData: TestBeanUpdate = { name: 'No Separator', value: 0 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of({}));

      updateBean(updateData, mockHttpClient, routerName, id, separator, createTestBean).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(expectedUrl, updateData);
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle malformed response data', () => {
      const routerName = 'malformed-test';
      const id = 'malformed-123';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Malformed', value: 400 };
      const malformedResponse = 'invalid json response';

      vi.mocked(mockHttpClient.put).mockReturnValue(of(malformedResponse));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          resolve();
        });
      });
    });

    it('should handle null response data', () => {
      const routerName = 'null-test';
      const id = 'null-123';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = { name: 'Null Test', value: 0 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(null));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          resolve();
        });
      });
    });

    it('should handle empty update data', () => {
      const routerName = 'empty-update-test';
      const id = 'empty-123';
      const idSeparator = '/';
      const updateData: TestBeanUpdate = {};
      const mockResponse = { id: 'empty-123', name: 'Unchanged', value: 100 };

      vi.mocked(mockHttpClient.put).mockReturnValue(of(mockResponse));

      return new Promise<void>((resolve) => {
        updateBean(
          updateData,
          mockHttpClient,
          routerName,
          id,
          idSeparator,
          createTestBean,
        ).subscribe((result) => {
          expect(result).toBeInstanceOf(TestBean);
          expect(result.getId()).toBe('empty-123');
          resolve();
        });
      });
    });
  });
});
