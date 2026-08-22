import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { expect, vi, describe, it, beforeEach } from 'vitest';

import { OwnerUpdateService } from './owner-update-service';
import { Owner, createOwner, ownerId } from './owner';
import { createHttpClientTestMock } from '../shared/http-client-test-mock';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

describe('OwnerUpdateService', () => {
  let service: OwnerUpdateService;
  let mockHttpClient: HttpClient;

  beforeEach(async () => {
    mockHttpClient = createHttpClientTestMock();

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

  it('should expose update method with expected signature', () => {
    TestUtils.testServiceMethods(service, ['update']);
    TestUtils.testServiceMethodSignatures(service, [{ methodName: 'update', parameterCount: 2 }]);
    expect(service.update).toBeTypeOf('function');
  });

  // Functional tests
  describe('update method', () => {
    it('should call HTTP PUT with correct parameters', () => {
      const ownerId = 'existing-owner';
      const updatedOwner = { name: 'Updated Owner' };
      const expectedResponse = { name: 'Updated Owner' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(expectedResponse));

      service.update(ownerId, updatedOwner).subscribe();

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${environment.apiUrl}/owners/${ownerId}`,
        updatedOwner,
      );
    });

    it('should return transformed Owner on successful update', async () => {
      const testOwnerId = 'test-owner';
      const updatedOwner = { name: 'Updated Name' };
      const mockResponse = { name: 'Updated Name' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.update(testOwnerId, updatedOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.name).toBe('Updated Name');
      expect(ownerId(result)).toBe('Updated Name');
    });

    it('should handle HTTP errors correctly', async () => {
      const testOwnerId = 'test-owner';
      const updatedOwner = { name: 'Updated Owner' };
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
          service.update(testOwnerId, updatedOwner).subscribe({
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
      const testOwnerId = 'test-owner';
      const updatedOwner = { name: 'Updated Owner' };
      const networkError = new Error('Network error');

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(
        throwError(() => networkError),
      );

      await expect(
        new Promise((resolve, reject) => {
          service.update(testOwnerId, updatedOwner).subscribe({
            next: resolve,
            error: reject,
          });
        }),
      ).rejects.toThrow('Network error');
    });

    it('should work with empty owner name', async () => {
      const testOwnerId = 'test-owner';
      const emptyOwner = { name: '' };
      const mockResponse = { name: '' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.update(testOwnerId, emptyOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.name).toBe('');
      expect(ownerId(result)).toBe('');
    });

    it('should work with special characters in name', async () => {
      const testOwnerId = 'special-owner';
      const specialOwner = { name: 'Owner & Co. Ltd. (Updated)' };
      const mockResponse = { name: 'Owner & Co. Ltd. (Updated)' };

      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

      const result = await new Promise<Owner>((resolve, reject) => {
        service.update(testOwnerId, specialOwner).subscribe({
          next: resolve,
          error: reject,
        });
      });

      expect(result.name).toBe('Owner & Co. Ltd. (Updated)');
      expect(ownerId(result)).toBe('Owner & Co. Ltd. (Updated)');
    });

    it('should handle server validation errors', async () => {
      const testOwnerId = 'test-owner';
      const updatedOwner = { name: 'Duplicate Name' };
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
          service.update(testOwnerId, updatedOwner).subscribe({
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
      const updatedOwner = { name: 'Updated Name' };
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
      const testOwnerId = 'test-owner';
      const updatedOwner = { name: 'Updated Owner' };
      (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(updatedOwner));

      const result = service.update(testOwnerId, updatedOwner);
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
        const owner = { name: testCase.name };
        const mockResponse = { name: testCase.name };

        (mockHttpClient.put as ReturnType<typeof vi.fn>).mockReturnValue(of(mockResponse));

        const result = await new Promise<Owner>((resolve, reject) => {
          service.update(testCase.id, owner).subscribe({
            next: resolve,
            error: reject,
          });
        });

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
      expect(newOwner.name).toBe('');
      expect(ownerId(newOwner)).toBe('');
    });
  });
});
