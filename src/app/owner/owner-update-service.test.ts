import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { OwnerUpdateService } from './owner-update-service';
import { Owner, createOwner } from './owner';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('OwnerUpdateService', () => {
  let service: OwnerUpdateService;
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

    await TestUtils.setupServiceTestBed(OwnerUpdateService, [
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    service = TestBed.inject(OwnerUpdateService);
  });

  // Basic service structure tests using TestUtils
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be a singleton service', () => {
    TestUtils.testServiceSingleton(OwnerUpdateService);
    expect(service).toBeDefined();
  });

  it('should have correct service structure', () => {
    TestUtils.testServiceStructure(service, OwnerUpdateService);
    expect(service).toBeInstanceOf(OwnerUpdateService);
  });

  it('should implement required methods', () => {
    TestUtils.testServiceMethods(service, ['update']);
    expect(typeof service.update).toBe('function');
  });

  it('should have correct method signatures', () => {
    TestUtils.testServiceMethodSignatures(service, [{ methodName: 'update', parameterCount: 2 }]);
    expect(service.update).toBeDefined();
  });

  // Functional tests
  describe('update method', () => {
    it('should call HTTP PUT with correct parameters', () => {
      const ownerId = 'existing-owner';
      const updatedOwner = new Owner('Updated Owner');
      const expectedResponse = new Owner('Updated Owner');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(ownerId, updatedOwner).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/owners/${ownerId}`,
        updatedOwner,
      );
    });

    it('should return transformed Owner on successful update', async () => {
      const ownerId = 'test-owner';
      const updatedOwner = new Owner('Updated Name');
      const mockResponse = { name: 'Updated Name' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.update(ownerId, updatedOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('Updated Name');
      expect(result.getId()).toBe('Updated Name');
    });

    it('should handle HTTP errors correctly', async () => {
      const ownerId = 'test-owner';
      const updatedOwner = new Owner('Updated Owner');
      const errorResponse = new HttpErrorResponse({
        error: 'Update failed',
        status: 404,
        statusText: 'Not Found',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => errorResponse),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(ownerId, updatedOwner).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should handle network errors', async () => {
      const ownerId = 'test-owner';
      const updatedOwner = new Owner('Updated Owner');
      const networkError = new Error('Network error');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(ownerId, updatedOwner).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should work with empty owner name', async () => {
      const ownerId = 'test-owner';
      const emptyOwner = new Owner('');
      const mockResponse = { name: '' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.update(ownerId, emptyOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('');
      expect(result.getId()).toBe('');
    });

    it('should work with special characters in name', async () => {
      const ownerId = 'special-owner';
      const specialOwner = new Owner('Owner & Co. Ltd. (Updated)');
      const mockResponse = { name: 'Owner & Co. Ltd. (Updated)' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.update(ownerId, specialOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('Owner & Co. Ltd. (Updated)');
      expect(result.getId()).toBe('Owner & Co. Ltd. (Updated)');
    });

    it('should handle server validation errors', async () => {
      const ownerId = 'test-owner';
      const updatedOwner = new Owner('Duplicate Name');
      const validationError = new HttpErrorResponse({
        error: { message: 'Owner name already exists' },
        status: 422,
        statusText: 'Unprocessable Entity',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => validationError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(ownerId, updatedOwner).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 422,
        error: { message: 'Owner name already exists' },
      });
    });

    it('should handle owner not found errors', async () => {
      const nonExistentId = 'non-existent-owner';
      const updatedOwner = new Owner('Updated Name');
      const notFoundError = new HttpErrorResponse({
        error: 'Owner not found',
        status: 404,
        statusText: 'Not Found',
      });

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => notFoundError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(nonExistentId, updatedOwner).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toMatchObject({
        status: 404,
        statusText: 'Not Found',
      });
    });

    it('should return Observable<Owner>', () => {
      const ownerId = 'test-owner';
      const updatedOwner = new Owner('Updated Owner');
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(updatedOwner));

      const result = service.update(ownerId, updatedOwner);
      expect(result).toBeInstanceOf(Observable);
    });

    it('should work with different owner ID formats', async () => {
      const testCases = [
        { id: 'simple-id', name: 'Simple Owner' },
        { id: 'owner-with-spaces', name: 'Owner With Spaces' },
        { id: '123-numeric-id', name: 'Numeric ID Owner' },
        { id: 'special!@#$%^&*()_+', name: 'Special Chars Owner' },
      ];

      for (const testCase of testCases) {
        const owner = new Owner(testCase.name);
        const mockResponse = { name: testCase.name };

        (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

        const result = await new Promise<Owner>((resolve, reject) => {
          service.update(testCase.id, owner).subscribe({
            next: resolve,
            error: reject,
          });
        });

        expect(result).toBeInstanceOf(Owner);
        expect(result.name).toBe(testCase.name);
        expect(mockHttpClient.put).toHaveBeenCalledWith(
          `${environment.apiUrl}/owners/${testCase.id}`,
          owner,
        );
      }
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
