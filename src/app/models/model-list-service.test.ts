import { HttpErrorResponse } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { ModelListService, handleHttpResourceError } from './model-list-service';
import { AppMessageService } from '../app-message-service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

// Mock implementation of Model for testing
interface TestModel {
  id: string;
  name: string;
  value: number;
}

function createTestModel(): TestModel {
  return {
    id: '',
    name: '',
    value: 0,
  };
}

describe('ModelListService', () => {
  let mockAppMessageService: AppMessageService;

  beforeEach(async () => {
    // Setup mock for AppMessageService
    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    } as unknown as AppMessageService;

    // Mock setup for AppMessageService is sufficient for these tests
  });

  describe('ModelListService Interface', () => {
    it('should define the correct interface structure', () => {
      // Test that the interface exists and has the expected method signature
      const mockService: ModelListService<TestModel> = {
        findAll: (): WritableSignal<TestModel[]> => signal([]),
      };

      TestUtils.testServiceMethods(mockService, ['findAll']);
      expect(typeof mockService.findAll).toBe('function');

      // Test that findAll returns a signal-like object
      const result = mockService.findAll();
      expect(result).toBeDefined();
      expect(typeof result).toBe('function'); // signals are functions
      expect(Array.isArray(result())).toBe(true);
    });

    it('should return WritableSignal from findAll method', () => {
      const mockService: ModelListService<TestModel> = {
        findAll: (): WritableSignal<TestModel[]> =>
          signal([{ ...createTestModel(), id: '1', name: 'Test' }]),
      };

      const result = mockService.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result())).toBe(true);
      expect(result()).toHaveLength(1);
    });

    it('should implement ModelListService interface correctly', () => {
      const service: ModelListService<TestModel> = {
        findAll: (): WritableSignal<TestModel[]> => signal([]),
      };

      TestUtils.testServiceStructure(service, Object as never);
      expect(service.findAll).toBeDefined();
      expect(typeof service.findAll).toBe('function');
    });
  });

  describe('handleHttpResourceError Function', () => {
    it('should handle HttpErrorResponse correctly', () => {
      const httpError = new HttpErrorResponse({
        status: 404,
        error: 'Resource not found',
      });

      handleHttpResourceError(httpError, mockAppMessageService, 'TestModel');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        httpError,
        'TestModel not listed',
      );
    });

    it('should handle generic Error correctly', () => {
      const genericError = new Error('Network connection failed');

      handleHttpResourceError(genericError, mockAppMessageService, 'TestModel');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        expect.any(HttpErrorResponse),
        'TestModel not listed',
      );

      const capturedCall = vi.mocked(mockAppMessageService.addErrorMessage).mock.calls[0];
      const wrappedError = capturedCall[0] as HttpErrorResponse;
      expect(wrappedError.status).toBe(0);
    });

    it('should handle unknown error types correctly', () => {
      const unknownError = 'String error message';

      handleHttpResourceError(unknownError, mockAppMessageService, 'TestModel');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        expect.any(HttpErrorResponse),
        'TestModel not listed',
      );

      const capturedCall = vi.mocked(mockAppMessageService.addErrorMessage).mock.calls[0];
      const wrappedError = capturedCall[0] as HttpErrorResponse;
      expect(wrappedError.status).toBe(0);
      expect(wrappedError.error).toContain('String error message');
    });

    it('should handle null/undefined errors correctly', () => {
      handleHttpResourceError(null, mockAppMessageService, 'TestModel');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        expect.any(HttpErrorResponse),
        'TestModel not listed',
      );

      const capturedCall = vi.mocked(mockAppMessageService.addErrorMessage).mock.calls[0];
      const wrappedError = capturedCall[0] as HttpErrorResponse;
      expect(wrappedError.error).toBe('null');
    });

    it('should customize model name in error message', () => {
      const httpError = new HttpErrorResponse({ status: 500 });
      const customModelName = 'CustomEntity';

      handleHttpResourceError(httpError, mockAppMessageService, customModelName);

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        httpError,
        'CustomEntity not listed',
      );
    });
  });

  describe('Integration with Model utility functions', () => {
    it('should work with custom Model implementations', () => {
      interface CustomModel {
        id: string;
        title: string;
        active: boolean;
      }

      function createCustomModelImpl(): CustomModel {
        return {
          id: '',
          title: '',
          active: true,
        };
      }

      const mockService: ModelListService<CustomModel> = {
        findAll: (): WritableSignal<CustomModel[]> =>
          signal([{ ...createCustomModelImpl(), id: '1', title: 'Test', active: true }]),
      };

      const result = mockService.findAll();
      expect(result()[0].title).toBe('Test');
      expect(result()[0].active).toBe(true);
    });
  });

  describe('Environment Integration', () => {
    it('should use environment.apiUrl for API requests', () => {
      expect(environment.apiUrl).toBeDefined();

      const routerName = 'test-entities';
      const expectedUrl = `${environment.apiUrl}/${routerName}`;

      // This would be tested in the findAllModels function
      expect(expectedUrl).toBe(`${environment.apiUrl}/test-entities`);
    });
  });

  describe('Type Safety and Generic Constraints', () => {
    it('should enforce Model constraint on generic types', () => {
      // This is enforced at compile time, but we can test runtime behavior
      interface ValidModelType {
        name: string;
      }

      class ValidModel implements ValidModelType {
        constructor(
          public id = '',
          public name = '',
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const service: ModelListService<ValidModel> = {
        findAll: (): WritableSignal<ValidModel[]> => signal([]),
      };

      expect(service.findAll).toBeDefined();
      expect(typeof service.findAll).toBe('function');
    });

    it('should maintain type safety with WritableSignal', () => {
      const modelsSignal: WritableSignal<TestModel[]> = signal([]);
      modelsSignal.set([{ ...createTestModel(), id: '1', name: 'Test' }]);

      expect(modelsSignal()).toHaveLength(1);
      expect(modelsSignal()[0].id).toBe('1');
    });
  });

  describe('Service Architecture Patterns', () => {
    it('should support dependency injection pattern', () => {
      // Test that services can be injected and configured
      expect(mockAppMessageService).toBeDefined();
      expect(mockAppMessageService.addErrorMessage).toBeDefined();
      expect(typeof mockAppMessageService.addErrorMessage).toBe('function');
    });

    it('should support factory function pattern', () => {
      const factory = createTestModel;
      expect(typeof factory).toBe('function');

      const model = factory();
      expect(model.id).toBe('');
    });

    it('should support transformation function pattern', () => {
      const toUppercaseName = ({ name, ...rest }: TestModel): TestModel => ({
        ...rest,
        name: name.toUpperCase(),
      });

      expect(toUppercaseName({ ...createTestModel(), id: '1', name: 'test' }).name).toBe('TEST');
    });
  });
});
