import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { AppMessageService } from './app-message-service';
import { TestUtils } from './shared/test-utils';

describe('AppMessageService', () => {
  let service: AppMessageService;
  let mockMessageService: Pick<MessageService, 'add'>;

  beforeEach(async () => {
    mockMessageService = {
      add: vi.fn(),
    };

    await TestUtils.setupServiceTestBed(AppMessageService, [
      { provide: MessageService, useValue: mockMessageService },
    ]);

    service = TestBed.inject(AppMessageService);
  });

  describe('Service Initialization', () => {
    it('should be created and initialized correctly', () => {
      TestUtils.testBasicInitialization(service, {}, AppMessageService);
    });

    it('should inject MessageService', () => {
      expect(mockMessageService).toBeDefined();
    });
  });

  describe('addErrorMessage', () => {
    describe('with HttpErrorResponse containing error message', () => {
      it('should add error message with parsed error detail', () => {
        const mockError = new HttpErrorResponse({
          error: { message: 'Custom error message' },
          status: 400,
          statusText: 'Bad Request',
        });

        service.addErrorMessage(mockError, 'Error Summary');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Error Summary',
          detail: 'Custom error message',
        });
      });

      it('should handle nested error message structure', () => {
        const mockError = new HttpErrorResponse({
          error: { message: 'Validation failed' },
          status: 422,
          statusText: 'Unprocessable Entity',
        });

        service.addErrorMessage(mockError, 'Validation Error');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Validation failed',
        });
      });
    });

    describe('with connection error (status 0)', () => {
      it('should show connection error message', () => {
        const mockError = new HttpErrorResponse({
          error: null,
          status: 0,
          statusText: 'Unknown Error',
        });

        service.addErrorMessage(mockError, 'Connection Error');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Connection Error',
          detail: 'Cannot connect to the server. Please check your internet connection.',
        });
      });

      it('should prioritize connection message over default detail', () => {
        const mockError = new HttpErrorResponse({
          error: null,
          status: 0,
          statusText: 'Unknown Error',
        });

        service.addErrorMessage(mockError, 'Network Issue', 'Custom default message');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Network Issue',
          detail: 'Cannot connect to the server. Please check your internet connection.',
        });
      });
    });

    describe('with default error handling', () => {
      it('should use default detail message when no specific error', () => {
        const mockError = new HttpErrorResponse({
          error: null,
          status: 500,
          statusText: 'Internal Server Error',
        });

        service.addErrorMessage(mockError, 'Server Error');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Server Error',
          detail: 'An unexpected error occurred.',
        });
      });

      it('should use custom default detail when provided', () => {
        const mockError = new HttpErrorResponse({
          error: null,
          status: 404,
          statusText: 'Not Found',
        });

        service.addErrorMessage(mockError, 'Not Found', 'Resource not found');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Not Found',
          detail: 'Resource not found',
        });
      });

      it('should handle error without error object', () => {
        const mockError = new HttpErrorResponse({
          status: 403,
          statusText: 'Forbidden',
        });

        service.addErrorMessage(mockError, 'Access Denied', 'You do not have permission');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Access Denied',
          detail: 'You do not have permission',
        });
      });
    });

    describe('method overloads', () => {
      it('should work with two parameters (error, summary)', () => {
        const mockError = new HttpErrorResponse({
          error: null,
          status: 500,
          statusText: 'Internal Server Error',
        });

        service.addErrorMessage(mockError, 'System Error');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'System Error',
          detail: 'An unexpected error occurred.',
        });
      });

      it('should work with three parameters (error, summary, defaultDetail)', () => {
        const mockError = new HttpErrorResponse({
          error: null,
          status: 503,
          statusText: 'Service Unavailable',
        });

        service.addErrorMessage(mockError, 'Service Unavailable', 'Service is temporarily down');

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Service Unavailable',
          detail: 'Service is temporarily down',
        });
      });
    });
  });

  describe('addSuccessMessage', () => {
    it('should add success message with provided summary and detail', () => {
      service.addSuccessMessage('Operation Successful', 'Your data has been saved successfully');

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Operation Successful',
        detail: 'Your data has been saved successfully',
      });
    });

    it('should handle empty strings', () => {
      service.addSuccessMessage('', '');

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: '',
        detail: '',
      });
    });

    it('should handle special characters in messages', () => {
      const summary = 'Success! 🎉';
      const detail = 'Data saved with special chars: @#$%^&*()';

      service.addSuccessMessage(summary, detail);

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: summary,
        detail: detail,
      });
    });

    it('should handle long messages', () => {
      const longSummary = 'A'.repeat(100);
      const longDetail = 'B'.repeat(500);

      service.addSuccessMessage(longSummary, longDetail);

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: longSummary,
        detail: longDetail,
      });
    });
  });

  describe('parseHttpError (private method behavior)', () => {
    it('should prioritize error.error.message over status-specific messages', () => {
      const mockError = new HttpErrorResponse({
        error: { message: 'Custom server message' },
        status: 0, // This would normally trigger connection error
        statusText: 'Unknown Error',
      });

      service.addErrorMessage(mockError, 'Test');

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Test',
        detail: 'Custom server message',
      });
    });

    it('should handle malformed error objects', () => {
      const mockError = new HttpErrorResponse({
        error: { someOtherProperty: 'value' }, // No message property
        status: 400,
        statusText: 'Bad Request',
      });

      service.addErrorMessage(mockError, 'Test', 'Fallback message');

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Test',
        detail: 'Fallback message',
      });
    });

    it('should handle error.error.message as empty string', () => {
      const mockError = new HttpErrorResponse({
        error: { message: '' },
        status: 400,
        statusText: 'Bad Request',
      });

      service.addErrorMessage(mockError, 'Test', 'Default message');

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Test',
        detail: 'Default message',
      });
    });

    it('should handle null error.error.message', () => {
      const mockError = new HttpErrorResponse({
        error: { message: null },
        status: 400,
        statusText: 'Bad Request',
      });

      service.addErrorMessage(mockError, 'Test', 'Default message');

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Test',
        detail: 'Default message',
      });
    });
  });

  describe('Integration with MessageService', () => {
    it('should call MessageService.add exactly once per method call', () => {
      service.addSuccessMessage('Test', 'Test detail');
      expect(mockMessageService.add).toHaveBeenCalledTimes(1);

      const mockError = new HttpErrorResponse({
        error: null,
        status: 500,
        statusText: 'Internal Server Error',
      });
      service.addErrorMessage(mockError, 'Error');
      expect(mockMessageService.add).toHaveBeenCalledTimes(2);
    });

    it('should not modify MessageService mock between calls', () => {
      service.addSuccessMessage('First', 'First detail');
      service.addSuccessMessage('Second', 'Second detail');

      expect(mockMessageService.add).toHaveBeenNthCalledWith(1, {
        severity: 'success',
        summary: 'First',
        detail: 'First detail',
      });

      expect(mockMessageService.add).toHaveBeenNthCalledWith(2, {
        severity: 'success',
        summary: 'Second',
        detail: 'Second detail',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined error object', () => {
      const mockError = new HttpErrorResponse({
        error: undefined,
        status: 500,
        statusText: 'Internal Server Error',
      });

      service.addErrorMessage(mockError, 'Undefined Error', 'Custom default');

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Undefined Error',
        detail: 'Custom default',
      });
    });

    it('should handle status codes with different behaviors', () => {
      // Test various HTTP status codes
      const testCases = [
        { status: 400, expected: 'Bad request error' },
        { status: 401, expected: 'Unauthorized error' },
        { status: 404, expected: 'Not found error' },
        { status: 500, expected: 'Server error' },
      ];

      testCases.forEach(({ status, expected }) => {
        const mockError = new HttpErrorResponse({
          error: null,
          status: status,
          statusText: 'Test',
        });

        service.addErrorMessage(mockError, 'Test', expected);

        expect(mockMessageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Test',
          detail: expected,
        });
      });
    });
  });
});
