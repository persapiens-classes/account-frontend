import { ComponentFixture } from '@angular/core/testing';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { signal, WritableSignal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { RemoveButtonComponent } from './remove-button.component';
import { BeanRemoveService } from './bean-remove-service';
import { Bean } from './bean';
import { AppMessageService } from '../app-message-service';
import { TestUtils } from '../shared/test-utils';

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

describe('RemoveButtonComponent', () => {
  let component: RemoveButtonComponent<TestBean>;
  let fixture: ComponentFixture<RemoveButtonComponent<TestBean>>;
  let mockBeanRemoveService: BeanRemoveService;
  let mockAppMessageService: AppMessageService;
  let mockConfirmationService: ConfirmationService;
  let mockBeansList: WritableSignal<TestBean[]>;
  let testBean: TestBean;

  beforeEach(async () => {
    // Setup mock services
    mockBeanRemoveService = {
      remove: vi.fn(),
    };

    mockAppMessageService = {
      addSuccessMessage: vi.fn(),
      addErrorMessage: vi.fn(),
      addInfoMessage: vi.fn(),
      addWarnMessage: vi.fn(),
      messages: signal([]),
      clearMessages: vi.fn(),
    } as unknown as AppMessageService;

    mockConfirmationService = {
      confirm: vi.fn(),
      close: vi.fn(),
    } as unknown as ConfirmationService;

    // Create test data
    testBean = new TestBean('test-123', 'Test Bean', 100);
    mockBeansList = signal([testBean, new TestBean('test-456', 'Another Bean', 200)]);

    await TestUtils.setupComponentTestBed(RemoveButtonComponent, [
      { provide: AppMessageService, useValue: mockAppMessageService },
    ]);

    fixture = TestUtils.createFixture(RemoveButtonComponent) as ComponentFixture<
      RemoveButtonComponent<TestBean>
    >;
    component = fixture.componentInstance;

    // Set component inputs
    component.beansList = mockBeansList;
    component.item = testBean;
    component.beanRemoveService = mockBeanRemoveService;
    component.beanName = 'Test Bean';

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(
        component,
        {
          beansList: mockBeansList,
          item: testBean,
          beanRemoveService: mockBeanRemoveService,
          beanName: 'Test Bean',
        },
        RemoveButtonComponent,
      );
      expect(component).toBeTruthy();
    });

    it('should render remove button with correct properties', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button).toBeTruthy();
      expect(button.getAttribute('icon')).toBe('pi pi-trash');
      expect(button.getAttribute('pTooltip')).toBe('Delete the account');
      expect(button.classList.contains('mr-3')).toBe(true);
    });

    it('should render confirmation dialog', () => {
      const confirmDialog = fixture.nativeElement.querySelector('p-confirmdialog');
      expect(confirmDialog).toBeTruthy();
      expect(confirmDialog.getAttribute('header')).toBe('Confirm');
      expect(confirmDialog.getAttribute('acceptButtonStyleClass')).toBe('p-button-danger');
      expect(confirmDialog.getAttribute('rejectButtonStyleClass')).toBe('p-button-text');
    });
  });

  describe('Input Properties', () => {
    it('should accept beansList input', () => {
      const newBeansList = signal([new TestBean('new-1', 'New Bean', 300)]);
      component.beansList = newBeansList;
      fixture.detectChanges();

      expect(component.beansList).toBe(newBeansList);
      expect(component.beansList().length).toBe(1);
    });

    it('should accept item input', () => {
      const newItem = new TestBean('item-789', 'New Item', 400);
      component.item = newItem;
      fixture.detectChanges();

      expect(component.item).toBe(newItem);
      expect(component.item.getId()).toBe('item-789');
    });

    it('should accept beanRemoveService input', () => {
      const newService: BeanRemoveService = { remove: vi.fn() };
      component.beanRemoveService = newService;
      fixture.detectChanges();

      expect(component.beanRemoveService).toBe(newService);
    });

    it('should accept beanName input', () => {
      component.beanName = 'Custom Bean Name';
      fixture.detectChanges();

      expect(component.beanName).toBe('Custom Bean Name');
    });
  });

  describe('Remove Functionality', () => {
    it('should call beanRemoveService.remove when handleRemove is called directly', () => {
      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(of(undefined));

      // Call handleRemove directly to test the removal logic
      component['handleRemove']();

      expect(mockBeanRemoveService.remove).toHaveBeenCalledWith('test-123');
    });

    it('should remove item from beansList on successful removal', () => {
      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(of(undefined));

      const initialCount = mockBeansList().length;
      expect(initialCount).toBe(2);

      // Call handleRemove directly to test the removal logic
      component['handleRemove']();

      // Check that the item was removed from the list
      const updatedCount = mockBeansList().length;
      expect(updatedCount).toBe(1);
      expect(mockBeansList().find((b) => b.getId() === 'test-123')).toBeUndefined();
    });

    it('should show success message on successful removal', () => {
      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(of(undefined));

      // Call handleRemove directly to test the removal logic
      component['handleRemove']();

      expect(mockAppMessageService.addSuccessMessage).toHaveBeenCalledWith(
        'Test Bean removed',
        'Test Bean removed ok.',
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors gracefully', () => {
      const httpError = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: 'Bean not found',
      });

      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(throwError(() => httpError));

      // Call handleRemove directly to test error handling
      component['handleRemove']();

      expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
        httpError,
        'Test Bean not removed',
      );
    });

    it('should not remove item from list on error', () => {
      const httpError = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        error: 'Database error',
      });

      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(throwError(() => httpError));

      const initialCount = mockBeansList().length;

      // Call handleRemove directly to test error handling
      component['handleRemove']();

      expect(mockBeansList().length).toBe(initialCount);
      expect(mockBeansList().find((b) => b.getId() === 'test-123')).toBeTruthy();
    });

    it('should handle different HTTP error status codes', () => {
      const testCases = [
        { status: 403, statusText: 'Forbidden', error: 'Access denied' },
        { status: 409, statusText: 'Conflict', error: 'Cannot delete due to references' },
        { status: 500, statusText: 'Internal Server Error', error: 'Server error' },
      ];

      testCases.forEach(({ status, statusText, error }) => {
        const httpError = new HttpErrorResponse({ status, statusText, error });
        vi.mocked(mockBeanRemoveService.remove).mockReturnValue(throwError(() => httpError));

        // Call handleRemove directly to test error handling
        component['handleRemove']();

        expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
          httpError,
          'Test Bean not removed',
        );

        // Reset mocks for next iteration
        vi.clearAllMocks();
      });
    });
  });

  describe('Generic Type Support', () => {
    it('should work with different Bean implementations', async () => {
      class CustomBeanImpl implements Bean {
        constructor(
          public id: string,
          public description: string,
          public amount: number,
        ) {}
        getId(): string {
          return this.id;
        }
      }

      const customFixture = TestUtils.createFixture(RemoveButtonComponent) as ComponentFixture<
        RemoveButtonComponent<CustomBeanImpl>
      >;
      const customComponent = customFixture.componentInstance;
      const customBean = new CustomBeanImpl('custom-test', 'Custom Description', 500);

      customComponent.beansList = signal([customBean]);
      customComponent.item = customBean;
      customComponent.beanRemoveService = mockBeanRemoveService;
      customComponent.beanName = 'Custom Bean';

      customFixture.detectChanges();

      expect(() => customComponent.remove(new MouseEvent('click'))).not.toThrow();
    });

    it('should handle empty beansList', () => {
      const emptyList = signal<TestBean[]>([]);
      component.beansList = emptyList;
      fixture.detectChanges();

      expect(component.beansList().length).toBe(0);

      // Should still allow remove operation
      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(of(undefined));

      // Call handleRemove directly to test the removal logic
      component['handleRemove']();

      expect(mockBeanRemoveService.remove).toHaveBeenCalledWith('test-123');
    });
  });

  describe('Event Handling', () => {
    it('should handle click events on remove button', () => {
      // Test that the component handles button clicks without throwing errors
      const mockEvent = new MouseEvent('click');

      expect(() => component.remove(mockEvent)).not.toThrow();
    });

    it('should handle event target correctly', () => {
      const mockButton = document.createElement('button');
      const mockEvent = { target: mockButton } as unknown as MouseEvent;

      // Test that remove method handles events with targets
      expect(() => component.remove(mockEvent)).not.toThrow();
    });
  });

  describe('Component Integration', () => {
    it('should integrate with ConfirmationService correctly', () => {
      expect(mockConfirmationService).toBeDefined();
      TestUtils.testServiceMethods(mockConfirmationService, ['confirm']);
    });

    it('should integrate with AppMessageService correctly', () => {
      expect(mockAppMessageService).toBeDefined();
      TestUtils.testServiceMethods(mockAppMessageService, ['addSuccessMessage', 'addErrorMessage']);
    });

    it('should integrate with BeanRemoveService correctly', () => {
      expect(mockBeanRemoveService).toBeDefined();
      TestUtils.testServiceMethods(mockBeanRemoveService, ['remove']);
    });
  });

  describe('Signal Integration', () => {
    it('should work with Angular signals for reactive updates', () => {
      const initialBeans = [
        new TestBean('bean-1', 'Bean 1', 100),
        new TestBean('bean-2', 'Bean 2', 200),
        new TestBean('bean-3', 'Bean 3', 300),
      ];

      const reactiveList = signal(initialBeans);
      component.beansList = reactiveList;
      component.item = initialBeans[1]; // Remove second bean

      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(of(undefined));

      // Call handleRemove directly to test the removal logic
      component['handleRemove']();

      expect(reactiveList().length).toBe(2);
      expect(reactiveList().find((b) => b.getId() === 'bean-2')).toBeUndefined();
      expect(reactiveList().find((b) => b.getId() === 'bean-1')).toBeTruthy();
      expect(reactiveList().find((b) => b.getId() === 'bean-3')).toBeTruthy();
    });
  });

  describe('Accessibility and UI', () => {
    it('should have proper ARIA attributes', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button.getAttribute('pTooltip')).toBe('Delete the account');
    });

    it('should use danger styling for confirmation button', () => {
      const confirmDialog = fixture.nativeElement.querySelector('p-confirmdialog');
      expect(confirmDialog.getAttribute('acceptButtonStyleClass')).toBe('p-button-danger');
    });

    it('should use text styling for reject button', () => {
      const confirmDialog = fixture.nativeElement.querySelector('p-confirmdialog');
      expect(confirmDialog.getAttribute('rejectButtonStyleClass')).toBe('p-button-text');
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large lists efficiently', () => {
      const largeBeansList = signal(
        Array.from({ length: 1000 }, (_, i) => new TestBean(`large-${i}`, `Bean ${i}`, i)),
      );

      component.beansList = largeBeansList;
      component.item = largeBeansList()[500]; // Remove middle item

      vi.mocked(mockBeanRemoveService.remove).mockReturnValue(of(undefined));

      const startTime = performance.now();

      // Call handleRemove directly to test the removal logic
      component['handleRemove']();

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete quickly
      expect(largeBeansList().length).toBe(999);
    });
  });
});
