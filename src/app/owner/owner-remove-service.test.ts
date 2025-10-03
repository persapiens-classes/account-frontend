import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { OwnerRemoveService } from './owner-remove-service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('OwnerRemoveService', () => {
  let service: OwnerRemoveService;
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

    await TestUtils.setupServiceTestBed(OwnerRemoveService, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    service = TestBed.inject(OwnerRemoveService);
  });

  // Basic service structure tests using TestUtils
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be a singleton service', () => {
    TestUtils.testServiceSingleton(OwnerRemoveService);
    expect(service).toBeDefined();
  });

  it('should have correct service structure', () => {
    TestUtils.testServiceStructure(service, OwnerRemoveService);
    expect(service).toBeInstanceOf(OwnerRemoveService);
  });

  it('should implement required methods', () => {
    TestUtils.testServiceMethods(service, ['remove']);
    expect(typeof service.remove).toBe('function');
  });

  it('should have correct method signatures', () => {
    TestUtils.testServiceMethodSignatures(service, [{ methodName: 'remove', parameterCount: 1 }]);
    expect(service.remove).toBeDefined();
  });

  // Functional tests
  describe('remove method', () => {
    it('should call HTTP DELETE with correct parameters', () => {
      const ownerId = 'owner-to-delete';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      service.remove(ownerId).subscribe();

      expect(mockHttpClient.delete).toHaveBeenCalledWith(`${environment.apiUrl}/owners/${ownerId}`);
    });

    it('should return void on successful removal', async () => {
      const ownerId = 'test-owner';

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = await new Promise<void>((resolve, reject) => {
        service.remove(ownerId).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeUndefined();
    });

    it('should handle HTTP errors correctly', async () => {
      const ownerId = 'test-owner';
      const errorResponse = new HttpErrorResponse({
        error: 'Deletion failed',
        status: 500,
        statusText: 'Internal Server Error',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(ownerId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should handle network errors', async () => {
      const ownerId = 'test-owner';
      const networkError = new Error('Network error');

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(ownerId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should handle owner not found errors', async () => {
      const nonExistentId = 'non-existent-owner';
      const notFoundError = new HttpErrorResponse({
        error: 'Owner not found',
        status: 404,
        statusText: 'Not Found',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => notFoundError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(nonExistentId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should handle constraint violation errors', async () => {
      const ownerId = 'owner-with-dependencies';
      const constraintError = new HttpErrorResponse({
        error: { message: 'Cannot delete owner with existing accounts' },
        status: 409,
        statusText: 'Conflict',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => constraintError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(ownerId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 409,
        error: { message: 'Cannot delete owner with existing accounts' },
      });
    });

    it('should return Observable<void>', () => {
      const ownerId = 'test-owner';
      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

      const result = service.remove(ownerId);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should work with different owner ID formats', async () => {
      const testIds = [
        'simple-id',
        'owner-with-spaces',
        '123-numeric-id',
        'special!@#$%^&*()_+',
        'very-long-owner-id-with-many-characters-and-numbers-12345',
      ];

      for (const ownerId of testIds) {
        (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));

        await new Promise<void>((resolve, reject) => {
          service.remove(ownerId).subscribe({
            next: resolve,
            error: reject,
          });
        });

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
          `${environment.apiUrl}/owners/${ownerId}`,
        );
      }
    });

    it('should handle authorization errors', async () => {
      const ownerId = 'protected-owner';
      const authError = new HttpErrorResponse({
        error: 'Unauthorized',
        status: 403,
        statusText: 'Forbidden',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => authError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(ownerId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 403,
        statusText: 'Forbidden',
      });
    });

    it('should handle timeout errors', async () => {
      const ownerId = 'slow-delete-owner';
      const timeoutError = new HttpErrorResponse({
        error: 'Request timeout',
        status: 408,
        statusText: 'Request Timeout',
      });

      (mockHttpClient.delete as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => timeoutError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.remove(ownerId).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 408,
        statusText: 'Request Timeout',
      });
    });
  });
});
