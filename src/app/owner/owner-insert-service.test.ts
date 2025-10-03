import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { OwnerInsertService } from './owner-insert-service';
import { Owner, createOwner } from './owner';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('OwnerInsertService', () => {
  let service: OwnerInsertService;
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

    await TestUtils.setupServiceTestBed(OwnerInsertService, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    service = TestBed.inject(OwnerInsertService);
  });

  // Basic service structure tests using TestUtils
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be a singleton service', () => {
    TestUtils.testServiceSingleton(OwnerInsertService);
    expect(service).toBeDefined();
  });

  it('should have correct service structure', () => {
    TestUtils.testServiceStructure(service, OwnerInsertService);
    expect(service).toBeInstanceOf(OwnerInsertService);
  });

  it('should implement required methods', () => {
    TestUtils.testServiceMethods(service, ['insert']);
    expect(typeof service.insert).toBe('function');
  });

  it('should have correct method signatures', () => {
    TestUtils.testServiceMethodSignatures(service, [{ methodName: 'insert', parameterCount: 1 }]);
    expect(service.insert).toBeDefined();
  });

  // Functional tests
  describe('insert method', () => {
    it('should call HTTP POST with correct parameters', () => {
      const testOwner = new Owner('Test Owner');
      const expectedResponse = new Owner('Test Owner');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.insert(testOwner).subscribe();

      expect(mockHttpClient.post).toHaveBeenCalledWith(`${environment.apiUrl}/owners`, testOwner);
    });

    it('should return transformed Owner on successful insert', async () => {
      const inputOwner = new Owner('New Owner');
      const mockResponse = { name: 'New Owner' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.insert(inputOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('New Owner');
      expect(result.getId()).toBe('New Owner');
    });

    it('should handle HTTP errors correctly', async () => {
      const testOwner = new Owner('Test Owner');
      const errorResponse = new HttpErrorResponse({
        error: 'Insert failed',
        status: 400,
        statusText: 'Bad Request',
      });

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testOwner).subscribe({
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
      const testOwner = new Owner('Test Owner');
      const networkError = new Error('Network error');

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testOwner).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should work with empty name', async () => {
      const emptyOwner = new Owner('');
      const mockResponse = { name: '' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.insert(emptyOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('');
      expect(result.getId()).toBe('');
    });

    it('should work with special characters in name', async () => {
      const specialOwner = new Owner('Owner & Co. Ltd. (Main)');
      const mockResponse = { name: 'Owner & Co. Ltd. (Main)' };

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.insert(specialOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('Owner & Co. Ltd. (Main)');
      expect(result.getId()).toBe('Owner & Co. Ltd. (Main)');
    });

    it('should handle server validation errors', async () => {
      const testOwner = new Owner('Test Owner');
      const validationError = new HttpErrorResponse({
        error: { message: 'Owner name already exists' },
        status: 422,
        statusText: 'Unprocessable Entity',
      });

      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => validationError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.insert(testOwner).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 422,
        error: { message: 'Owner name already exists' },
      });
    });

    it('should return Observable<Owner>', () => {
      const testOwner = new Owner('Test Owner');
      (mockHttpClient.post as ReturnType<typeof vi.fn>).mockReturnValue(of(testOwner));

      const result = service.insert(testOwner);
      expect(result).toBeInstanceOf(Observable);
    });
  });

  // Test createOwner factory function integration
  describe('createOwner integration', () => {
    it('should work with createOwner factory', () => {
      const newOwner = createOwner();
      expect(newOwner).toBeInstanceOf(Owner);
      expect(newOwner.name).toBe('');
      expect(newOwner.getId()).toBe('');
    });
  });
});
