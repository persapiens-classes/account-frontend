import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { BeanRemoveService, removeBean } from './bean-remove-service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('BeanRemoveService', () => {
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

  describe('BeanRemoveService Interface', () => {
    it('should define the correct interface structure', () => {
      // Test that the interface exists and has the expected method signature
      const mockService: BeanRemoveService = {
        remove: (): Observable<void> => of(undefined),
      };

      TestUtils.testServiceMethods(mockService, ['remove']);
      expect(typeof mockService.remove).toBe('function');

      // Test that remove returns an Observable<void>
      const result = mockService.remove('123');
      expect(result).toBeInstanceOf(Observable);
    });

    it('should implement remove method with correct signature', () => {
      const service: BeanRemoveService = {
        remove: (id: string): Observable<void> => {
          // Acknowledge parameter is intentionally unused in mock
          expect(id).toBeDefined();
          return of(undefined);
        },
      };

      TestUtils.testServiceMethodSignatures(service, [{ methodName: 'remove', parameterCount: 1 }]);
      expect(service.remove).toBeDefined();
    });

    it('should handle string ID parameter correctly', () => {
      const service: BeanRemoveService = {
        remove: (id: string): Observable<void> => {
          expect(typeof id).toBe('string');
          expect(id.length).toBeGreaterThan(0);
          return of(undefined);
        },
      };

      // Test with various ID formats
      const testIds = ['123', 'user-456', 'composite,id', 'uuid-abc-def-123'];
      testIds.forEach((testId) => {
        const result = service.remove(testId);
        expect(result).toBeInstanceOf(Observable);
      });
    });
  });

  describe('removeBean Function', () => {
    it('should construct correct API URL with simple ID', () => {
      const routerName = 'test-beans';
      const id = '123';
      const idSeparator = '/';
      const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl);
    });

    it('should construct correct API URL with composite ID using comma separator', () => {
      const routerName = 'owners';
      const id = 'parent-123,child-456';
      const idSeparator = '/';
      const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl);
    });

    it('should send DELETE request to correct endpoint', () => {
      const routerName = 'test-deletions';
      const id = 'delete-123';
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${environment.apiUrl}/${routerName}/${id}`,
      );
      expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);
    });

    it('should return Observable<void> on successful deletion', () => {
      const routerName = 'success-test';
      const id = 'success-456';
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe((result) => {
          expect(result).toBeUndefined();
          resolve();
        });
      });
    });

    it('should handle HTTP errors correctly', () => {
      const routerName = 'error-deletions';
      const id = 'error-123';
      const idSeparator = '/';
      const httpError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: 'Entity not found for deletion',
      });

      vi.mocked(mockHttpClient.delete).mockReturnValue(throwError(() => httpError));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe({
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
      const routerName = 'server-error-deletions';
      const id = 'server-error-456';
      const idSeparator = '/';
      const serverError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Database deletion failed',
      });

      vi.mocked(mockHttpClient.delete).mockReturnValue(throwError(() => serverError));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe({
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

    it('should handle forbidden deletion errors', () => {
      const routerName = 'forbidden-deletions';
      const id = 'forbidden-789';
      const idSeparator = '/';
      const forbiddenError = new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
        error: 'Insufficient permissions to delete entity',
      });

      vi.mocked(mockHttpClient.delete).mockReturnValue(throwError(() => forbiddenError));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe({
          next: () => {
            throw new Error('Should not reach success handler');
          },
          error: (error) => {
            expect(error.status).toBe(403);
            expect(error.statusText).toBe('Forbidden');
            resolve();
          },
        });
      });
    });

    it('should handle conflict deletion errors', () => {
      const routerName = 'conflict-deletions';
      const id = 'conflict-101';
      const idSeparator = '/';
      const conflictError = new HttpErrorResponse({
        status: 409,
        statusText: 'Conflict',
        error: 'Cannot delete entity due to existing references',
      });

      vi.mocked(mockHttpClient.delete).mockReturnValue(throwError(() => conflictError));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe({
          next: () => {
            throw new Error('Should not reach success handler');
          },
          error: (error) => {
            expect(error.status).toBe(409);
            expect(error.statusText).toBe('Conflict');
            resolve();
          },
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

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl);
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
        const idSeparator = '/';
        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

        expect(mockHttpClient.delete).toHaveBeenCalledWith(expected);
      });
    });

    it('should handle complex composite IDs with environment URLs', () => {
      const testCases = [
        {
          routerName: 'composite-entities',
          id: 'parent-1,child-2',
          expected: `${environment.apiUrl}/composite-entities/parent-1,child-2`,
        },
        {
          routerName: 'nested-resources',
          id: 'level1-a,level2-b,level3-c',
          expected: `${environment.apiUrl}/nested-resources/level1-a,level2-b,level3-c`,
        },
      ];

      testCases.forEach(({ routerName, id, expected }) => {
        const idSeparator = '/';
        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

        expect(mockHttpClient.delete).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('ID Separator Handling', () => {
    it('should handle different ID separators', () => {
      const testCases = [
        { separator: '/', expected: `${environment.apiUrl}/test-router/test-id` },
        { separator: '-', expected: `${environment.apiUrl}/test-router-test-id` },
        { separator: '_', expected: `${environment.apiUrl}/test-router_test-id` },
        { separator: '?id=', expected: `${environment.apiUrl}/test-router?id=test-id` },
      ];

      testCases.forEach(({ separator, expected }) => {
        const routerName = 'test-router';
        const id = 'test-id';

        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        removeBean(mockHttpClient, routerName, id, separator).subscribe();

        expect(mockHttpClient.delete).toHaveBeenCalledWith(expected);
      });
    });

    it('should handle empty ID separator', () => {
      const routerName = 'no-separator';
      const id = 'nosep123';
      const separator = '';
      const expectedUrl = `${environment.apiUrl}/${routerName}${id}`;

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      removeBean(mockHttpClient, routerName, id, separator).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl);
    });

    it('should handle special characters in ID separators', () => {
      const testCases = [
        {
          separator: '/',
          id: 'special-123',
          expected: `${environment.apiUrl}/special-router/special-123`,
        },
        {
          separator: '?key=',
          id: 'query-456',
          expected: `${environment.apiUrl}/special-router?key=query-456`,
        },
        {
          separator: '#',
          id: 'hash-789',
          expected: `${environment.apiUrl}/special-router#hash-789`,
        },
      ];

      testCases.forEach(({ separator, id, expected }) => {
        const routerName = 'special-router';

        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        removeBean(mockHttpClient, routerName, id, separator).subscribe();

        expect(mockHttpClient.delete).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('Type Safety and Observable Handling', () => {
    it('should return Observable<void> type', () => {
      const routerName = 'type-test';
      const id = 'type-123';
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      const result$ = removeBean(mockHttpClient, routerName, id, idSeparator);

      expect(result$).toBeInstanceOf(Observable);

      return new Promise<void>((resolve, reject) => {
        result$.subscribe({
          next: (value) => {
            expect(value).toBeUndefined();
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    });

    it('should handle Observable streams correctly', () => {
      const routerName = 'stream-test';
      const id = 'stream-123';
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      const result$ = removeBean(mockHttpClient, routerName, id, idSeparator);

      expect(result$).toBeInstanceOf(Observable);

      return new Promise<void>((resolve) => {
        let callbackInvoked = false;
        result$.subscribe({
          next: () => {
            callbackInvoked = true;
          },
          complete: () => {
            expect(callbackInvoked).toBe(true);
            resolve();
          },
        });
      });
    });

    it('should complete Observable on successful deletion', () => {
      const routerName = 'complete-test';
      const id = 'complete-456';
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe({
          next: (value) => {
            expect(value).toBeUndefined();
          },
          complete: () => {
            resolve();
          },
        });
      });
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle network timeout errors', () => {
      const routerName = 'timeout-test';
      const id = 'timeout-123';
      const idSeparator = '/';
      const timeoutError = new HttpErrorResponse({
        status: 408,
        statusText: 'Request Timeout',
        error: 'Delete request timed out',
      });

      vi.mocked(mockHttpClient.delete).mockReturnValue(throwError(() => timeoutError));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe({
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

    it('should handle malformed ID parameters', () => {
      const routerName = 'malformed-test';
      const malformedIds = ['', '   ', null as unknown as string, undefined as unknown as string];
      const idSeparator = '/';

      malformedIds.forEach((malformedId) => {
        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        // The function should still construct a URL, even with malformed IDs
        removeBean(mockHttpClient, routerName, malformedId, idSeparator).subscribe();

        expect(mockHttpClient.delete).toHaveBeenCalled();
      });
    });

    it('should handle service unavailable errors', () => {
      const routerName = 'unavailable-test';
      const id = 'unavailable-123';
      const idSeparator = '/';
      const serviceError = new HttpErrorResponse({
        status: 503,
        statusText: 'Service Unavailable',
        error: 'Deletion service temporarily unavailable',
      });

      vi.mocked(mockHttpClient.delete).mockReturnValue(throwError(() => serviceError));

      return new Promise<void>((resolve) => {
        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe({
          next: () => {
            throw new Error('Should not reach success handler');
          },
          error: (error) => {
            expect(error.status).toBe(503);
            expect(error.statusText).toBe('Service Unavailable');
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
      TestUtils.testServiceMethods(mockHttpClient, ['delete']);
    });

    it('should support functional composition', () => {
      const routerName = 'composition-test';
      const id = 'comp-123';
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      // Test that the function can be composed with other operations
      const deleteAndLog = (
        httpClient: HttpClient,
        router: string,
        entityId: string,
        separator: string,
      ) => {
        return removeBean(httpClient, router, entityId, separator);
      };

      const result$ = deleteAndLog(mockHttpClient, routerName, id, idSeparator);
      expect(result$).toBeInstanceOf(Observable);

      return new Promise<void>((resolve) => {
        result$.subscribe(() => {
          expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${environment.apiUrl}/${routerName}/${id}`,
          );
          resolve();
        });
      });
    });

    it('should support service composition with other Bean services', () => {
      const service: BeanRemoveService = {
        remove: (id: string): Observable<void> => {
          expect(id).toBeDefined();
          return removeBean(mockHttpClient, 'composed-entities', id, '/');
        },
      };

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      return new Promise<void>((resolve) => {
        service.remove('composed-123').subscribe(() => {
          expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${environment.apiUrl}/composed-entities/composed-123`,
          );
          resolve();
        });
      });
    });

    it('should support chain operations', () => {
      const routerName = 'chain-test';
      const ids = ['chain-1', 'chain-2', 'chain-3'];
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      // Test multiple sequential deletions
      const deletePromises = ids.map((id) =>
        firstValueFrom(removeBean(mockHttpClient, routerName, id, idSeparator)),
      );

      return Promise.all(deletePromises).then(() => {
        expect(mockHttpClient.delete).toHaveBeenCalledTimes(3);
        ids.forEach((id) => {
          expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${environment.apiUrl}/${routerName}/${id}`,
          );
        });
      });
    });
  });

  describe('URL Construction Edge Cases', () => {
    it('should handle special characters in IDs', () => {
      const testCases = [
        { id: 'user-123', expected: '/user-123' },
        { id: 'item_456', expected: '/item_456' },
        { id: 'comp.789', expected: '/comp.789' },
        { id: 'encoded%20id', expected: '/encoded%20id' },
      ];

      testCases.forEach(({ id, expected }) => {
        const routerName = 'special-chars';
        const fullExpected = `${environment.apiUrl}/${routerName}${expected}`;
        const idSeparator = '/';

        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

        expect(mockHttpClient.delete).toHaveBeenCalledWith(fullExpected);
      });
    });

    it('should handle very long IDs', () => {
      const longId = Array.from({ length: 100 }, (_, i) => `segment-${i}`).join('-');
      const routerName = 'long-id-test';
      const idSeparator = '/';
      const expectedUrl = `${environment.apiUrl}/${routerName}/${longId}`;

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      removeBean(mockHttpClient, routerName, longId, idSeparator).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl);
    });

    it('should handle single character IDs', () => {
      const testCases = ['a', '1', 'x', 'z'];

      testCases.forEach((id) => {
        const routerName = 'single-char';
        const idSeparator = '/';
        const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;

        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe();

        expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });

  describe('Performance and Efficiency', () => {
    it('should handle multiple concurrent deletions', () => {
      const routerName = 'concurrent-deletions';
      const ids = Array.from({ length: 5 }, (_, i) => `concurrent-${i}`);
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      const deleteObservables = ids.map((id) =>
        removeBean(mockHttpClient, routerName, id, idSeparator),
      );

      return new Promise<void>((resolve) => {
        let completedCount = 0;

        deleteObservables.forEach((observable) => {
          observable.subscribe(() => {
            completedCount++;
            if (completedCount === ids.length) {
              expect(mockHttpClient.delete).toHaveBeenCalledTimes(5);
              ids.forEach((id) => {
                expect(mockHttpClient.delete).toHaveBeenCalledWith(
                  `${environment.apiUrl}/${routerName}/${id}`,
                );
              });
              resolve();
            }
          });
        });
      });
    });

    it('should maintain performance with complex router names', () => {
      const complexRouterNames = [
        'very-long-router-name-with-multiple-segments',
        'nested/resource/path',
        'api/v2/resources',
      ];
      const id = 'performance-test';
      const idSeparator = '/';

      complexRouterNames.forEach((routerName) => {
        const expectedUrl = `${environment.apiUrl}/${routerName}/${id}`;

        vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

        const startTime = performance.now();

        removeBean(mockHttpClient, routerName, id, idSeparator).subscribe(() => {
          const endTime = performance.now();
          const duration = endTime - startTime;

          expect(duration).toBeLessThan(10); // Should complete very quickly
          expect(mockHttpClient.delete).toHaveBeenCalledWith(expectedUrl);
        });
      });
    });

    it('should efficiently handle batch deletions', () => {
      const routerName = 'batch-deletions';
      const batchSize = 10;
      const ids = Array.from({ length: batchSize }, (_, i) => `batch-item-${i}`);
      const idSeparator = '/';

      vi.mocked(mockHttpClient.delete).mockReturnValue(of(undefined));

      const startTime = performance.now();

      const batchPromises = ids.map((id) =>
        firstValueFrom(removeBean(mockHttpClient, routerName, id, idSeparator)),
      );

      return Promise.all(batchPromises).then(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100); // Should complete reasonably quickly
        expect(mockHttpClient.delete).toHaveBeenCalledTimes(batchSize);
      });
    });
  });
});
