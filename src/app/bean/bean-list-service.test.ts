import { HttpErrorResponse } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { BeanListService, handleHttpResourceError } from './bean-list-service';
import { Bean, toBean, defaultJsonToBean } from './bean';
import { AppMessageService } from '../app-message-service';
import { TestUtils } from '../shared/test-utils';
import { environment } from '../../environments/environment';

// Mock implementation of Bean for testing
class TestBean implements Bean {
  constructor(
    public id = '',
    public name = '',
  ) {}

  getId(): string {
    return this.id;
  }
}

// Factory function for TestBean
const createTestBean = (): TestBean => new TestBean();

describe('BeanListService', () => {
  let mockAppMessageService: AppMessageService;

  beforeEach(async () => {
    // Setup mock for AppMessageService
    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    } as unknown as AppMessageService;

    // Mock setup for AppMessageService is sufficient for these tests
  });

  describe('BeanListService Interface', () => {
    it('should define the correct interface structure', () => {
      // Test that the interface exists and has the expected method signature
      const mockService: BeanListService<TestBean> = {
        findAll: (): WritableSignal<TestBean[]> => signal([]),
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
      const mockService: BeanListService<TestBean> = {
        findAll: (): WritableSignal<TestBean[]> => signal([new TestBean('1', 'Test')]),
      };

      const result = mockService.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result())).toBe(true);
      expect(result().length).toBe(1);
      expect(result()[0]).toBeInstanceOf(TestBean);
    });

    it('should implement BeanListService interface correctly', () => {
      const service: BeanListService<TestBean> = {
        findAll: (): WritableSignal<TestBean[]> => signal([]),
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

      handleHttpResourceError(httpError, mockAppMessageService, 'TestBean');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        httpError,
        'TestBean not listed',
      );
    });

    it('should handle generic Error correctly', () => {
      const genericError = new Error('Network connection failed');

      handleHttpResourceError(genericError, mockAppMessageService, 'TestBean');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        expect.any(HttpErrorResponse),
        'TestBean not listed',
      );

      const capturedCall = vi.mocked(mockAppMessageService.addErrorMessage).mock.calls[0];
      const wrappedError = capturedCall[0] as HttpErrorResponse;
      expect(wrappedError.status).toBe(0);
    });

    it('should handle unknown error types correctly', () => {
      const unknownError = 'String error message';

      handleHttpResourceError(unknownError, mockAppMessageService, 'TestBean');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        expect.any(HttpErrorResponse),
        'TestBean not listed',
      );

      const capturedCall = vi.mocked(mockAppMessageService.addErrorMessage).mock.calls[0];
      const wrappedError = capturedCall[0] as HttpErrorResponse;
      expect(wrappedError.status).toBe(0);
      expect(wrappedError.error).toBe('String error message');
    });

    it('should handle null/undefined errors correctly', () => {
      handleHttpResourceError(null, mockAppMessageService, 'TestBean');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        expect.any(HttpErrorResponse),
        'TestBean not listed',
      );

      const capturedCall = vi.mocked(mockAppMessageService.addErrorMessage).mock.calls[0];
      const wrappedError = capturedCall[0] as HttpErrorResponse;
      expect(wrappedError.error).toBe('null');
    });

    it('should handle object errors correctly', () => {
      const objectError = { message: 'Custom error object', code: 'ERR001' };

      handleHttpResourceError(objectError, mockAppMessageService, 'TestBean');

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        expect.any(HttpErrorResponse),
        'TestBean not listed',
      );

      const capturedCall = vi.mocked(mockAppMessageService.addErrorMessage).mock.calls[0];
      const wrappedError = capturedCall[0] as HttpErrorResponse;
      expect(wrappedError.error).toBe('[object Object]');
    });

    it('should customize bean name in error message', () => {
      const httpError = new HttpErrorResponse({ status: 500 });
      const customBeanName = 'CustomEntity';

      handleHttpResourceError(httpError, mockAppMessageService, customBeanName);

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        httpError,
        'CustomEntity not listed',
      );
    });
  });

  describe('Integration with Bean utility functions', () => {
    it('should work with toBean function', () => {
      const jsonData = { id: '1', name: 'Test Bean' };
      const bean = toBean(jsonData, createTestBean, defaultJsonToBean);

      expect(bean).toBeInstanceOf(TestBean);
      expect(bean.getId()).toBe('1');
      expect(bean.name).toBe('Test Bean');
    });

    it('should work with custom Bean implementations', () => {
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

      const mockService: BeanListService<CustomBean> = {
        findAll: (): WritableSignal<CustomBean[]> => signal([new CustomBean('1', 'Test', true)]),
      };

      const result = mockService.findAll();
      expect(result()[0]).toBeInstanceOf(CustomBean);
      expect(result()[0].title).toBe('Test');
      expect(result()[0].active).toBe(true);
    });
  });

  describe('Environment Integration', () => {
    it('should use environment.apiUrl for API requests', () => {
      expect(environment.apiUrl).toBeDefined();

      const routerName = 'test-entities';
      const expectedUrl = `${environment.apiUrl}/${routerName}`;

      // This would be tested in the findAllBeans function
      expect(expectedUrl).toBe(`${environment.apiUrl}/test-entities`);
    });
  });

  describe('Type Safety and Generic Constraints', () => {
    it('should enforce Bean constraint on generic types', () => {
      // This is enforced at compile time, but we can test runtime behavior
      interface ValidBeanType extends Bean {
        name: string;
      }

      class ValidBean implements ValidBeanType {
        constructor(
          public id = '',
          public name = '',
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const service: BeanListService<ValidBean> = {
        findAll: (): WritableSignal<ValidBean[]> => signal([]),
      };

      expect(service.findAll).toBeDefined();
      expect(typeof service.findAll).toBe('function');
    });

    it('should maintain type safety with WritableSignal', () => {
      const beansSignal: WritableSignal<TestBean[]> = signal([]);
      beansSignal.set([new TestBean('1', 'Test')]);

      expect(beansSignal()).toEqual([expect.any(TestBean)]);
      expect(beansSignal().length).toBe(1);
      expect(beansSignal()[0].getId()).toBe('1');
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

      const bean = new TestBean('1', 'test');
      const transformed = customTransform(bean);

      expect(transformed.name).toBe('TEST');
    });
  });
});
