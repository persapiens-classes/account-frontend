import { ComponentFixture } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { OwnerUpdateComponent } from './owner-update.component';
import { OwnerUpdateService } from './owner-update-service';
import { Owner, createOwner } from './owner';
import { TestUtils } from '../shared/test-utils';
import { AppMessageService } from '../app-message-service';

// Mock history.state for testing
const mockHistoryState = {
  bean: {
    name: 'Test Owner From History',
  },
};

// Mock history object
Object.defineProperty(window, 'history', {
  value: {
    state: mockHistoryState,
  },
  writable: true,
  configurable: true,
});

describe('OwnerUpdateComponent', () => {
  let component: OwnerUpdateComponent;
  let fixture: ComponentFixture<OwnerUpdateComponent>;
  let mockOwnerUpdateService: {
    update: ReturnType<typeof vi.fn>;
    http: unknown;
  };
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockAppMessageService: {
    addErrorMessage: ReturnType<typeof vi.fn>;
    addSuccessMessage: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Reset history state for each test
    Object.defineProperty(window, 'history', {
      value: { state: mockHistoryState },
      writable: true,
      configurable: true,
    });

    // Create service mocks
    mockOwnerUpdateService = {
      update: vi.fn().mockReturnValue(of(new Owner('Updated Owner'))),
      http: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(OwnerUpdateComponent, [
      { provide: OwnerUpdateService, useValue: mockOwnerUpdateService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
      FormBuilder,
    ]);

    fixture = TestUtils.createFixture(OwnerUpdateComponent);
    component = fixture.componentInstance;
  });

  // Basic component structure tests using TestUtils
  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, OwnerUpdateComponent);
      expect(component).toBeTruthy();
    });

    it('should have correct form group configuration', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.get('inputName')).toBeDefined();

      const nameControl = component.formGroup.get('inputName');
      expect(nameControl?.value).toBe('Test Owner From History');
      expect(nameControl?.valid).toBe(true);
    });

    it('should inject required services', () => {
      expect(component.beanUpdateService).toBeDefined();
      expect(component.beanUpdateService).toBe(mockOwnerUpdateService);
    });

    it('should initialize with data from history', () => {
      expect(component.beanFromHistory).toBeDefined();
      expect(component.beanFromHistory.name).toBe('Test Owner From History');
      expect(component.formGroup.get('inputName')?.value).toBe('Test Owner From History');
    });

    it('should load beanFromHistory using toBeanFromHistory utility', () => {
      expect(component.beanFromHistory).toBeInstanceOf(Owner);
      expect(component.beanFromHistory.name).toBe('Test Owner From History');
    });
  });

  // Form validation tests
  describe('Form Validation', () => {
    it('should validate required name field', () => {
      const nameControl = component.formGroup.get('inputName');

      // Test empty value
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBe(true);
      expect(component.formGroup.invalid).toBe(true);

      // Test valid value
      nameControl?.setValue('Test Owner');
      expect(nameControl?.hasError('required')).toBe(false);
      expect(nameControl?.valid).toBe(true);
    });

    it('should validate minimum length for name field', () => {
      const nameControl = component.formGroup.get('inputName');

      // Test too short
      nameControl?.setValue('ab');
      expect(nameControl?.hasError('minlength')).toBe(true);
      expect(component.formGroup.invalid).toBe(true);

      // Test minimum valid length
      nameControl?.setValue('abc');
      expect(nameControl?.hasError('minlength')).toBe(false);
      expect(nameControl?.valid).toBe(true);

      // Test longer valid value
      nameControl?.setValue('Updated Owner Name');
      expect(nameControl?.hasError('minlength')).toBe(false);
      expect(nameControl?.valid).toBe(true);
    });

    it('should accept special characters in name field', () => {
      const nameControl = component.formGroup.get('inputName');
      const specialNames = [
        'Owner & Co. Ltd.',
        'Owner "Quoted" Name',
        "Owner's Possessive",
        'Owner-Hyphenated',
        'Owner (Parentheses)',
      ];

      specialNames.forEach((name) => {
        nameControl?.setValue(name);
        expect(nameControl?.valid).toBe(true);
        expect(component.formGroup.valid).toBe(true);
      });
    });

    it('should initialize with valid form state from history data', () => {
      // Form should be valid on initialization since history has valid data
      expect(component.formGroup.valid).toBe(true);
      expect(component.formGroup.get('inputName')?.value).toBe('Test Owner From History');
    });
  });

  // Template rendering tests
  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render BeanUpdatePanelComponent with correct properties', () => {
      const beanUpdatePanel = fixture.debugElement.query(By.css('app-bean-update-panel'));
      expect(beanUpdatePanel).toBeTruthy();

      const panelComponent = beanUpdatePanel.componentInstance;
      expect(panelComponent.formGroup).toBe(component.formGroup);
      expect(panelComponent.beanFromHistory).toBe(component.beanFromHistory);
      expect(panelComponent.beanUpdateService).toBe(mockOwnerUpdateService);
      expect(panelComponent.beanName).toBe('Owner');
      expect(panelComponent.routerName).toBe('owners');
    });

    it('should render InputFieldComponent with correct configuration', () => {
      const inputField = fixture.debugElement.query(By.css('app-input-field'));
      expect(inputField).toBeTruthy();

      const inputComponent = inputField.componentInstance;
      expect(inputComponent.label).toBe('Name');
      expect(inputComponent.autoFocus).toBe(true);
    });

    it('should bind form control to input field', () => {
      const inputField = fixture.debugElement.query(
        By.css('app-input-field[formControlName="inputName"]'),
      );
      expect(inputField).toBeTruthy();
    });

    it('should use required modules', () => {
      const formElement = fixture.debugElement.query(By.css('form, [formGroup]'));
      expect(formElement).toBeTruthy();
    });
  });

  // createBean method tests
  describe('createBean Method', () => {
    it('should create Owner from form values', () => {
      const testName = 'Updated Owner Name';
      component.formGroup.get('inputName')?.setValue(testName);

      const createdOwner = component.createBean();

      expect(createdOwner).toBeInstanceOf(Owner);
      expect(createdOwner.name).toBe(testName);
    });

    it('should handle empty form values', () => {
      component.formGroup.get('inputName')?.setValue('');

      const createdOwner = component.createBean();

      expect(createdOwner).toBeInstanceOf(Owner);
      expect(createdOwner.name).toBe('');
    });

    it('should handle special characters in form values', () => {
      const specialName = 'Updated Owner & Co. "Special" Ltd.';
      component.formGroup.get('inputName')?.setValue(specialName);

      const createdOwner = component.createBean();

      expect(createdOwner).toBeInstanceOf(Owner);
      expect(createdOwner.name).toBe(specialName);
    });

    it('should be bound correctly to BeanUpdatePanel', () => {
      fixture.detectChanges();

      const beanUpdatePanel = fixture.debugElement.query(By.css('app-bean-update-panel'));
      const createBeanFunction = beanUpdatePanel.componentInstance.createBean;
      expect(createBeanFunction).toBeDefined();
      expect(typeof createBeanFunction).toBe('function');

      // Test that the bound function works
      component.formGroup.get('inputName')?.setValue('Bound Update Test Owner');
      const result = createBeanFunction();
      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('Bound Update Test Owner');
    });
  });

  // Service integration tests
  describe('Service Integration', () => {
    it('should inject OwnerUpdateService correctly', () => {
      expect(component.beanUpdateService).toBe(mockOwnerUpdateService);
      expect(component.beanUpdateService.update).toBeDefined();
    });

    it('should pass service to BeanUpdatePanel', () => {
      fixture.detectChanges();

      const beanUpdatePanel = fixture.debugElement.query(By.css('app-bean-update-panel'));
      expect(beanUpdatePanel.componentInstance.beanUpdateService).toBe(mockOwnerUpdateService);
    });

    it('should maintain service reference throughout lifecycle', () => {
      const initialService = component.beanUpdateService;
      fixture.detectChanges();

      // Service should remain the same
      expect(component.beanUpdateService).toBe(initialService);
      expect(component.beanUpdateService).toBe(mockOwnerUpdateService);
    });
  });

  // History data handling tests
  describe('History Data Handling', () => {
    it('should load owner data from history state', () => {
      expect(component.beanFromHistory).toBeInstanceOf(Owner);
      expect(component.beanFromHistory.name).toBe('Test Owner From History');
    });

    it('should initialize form with history data', () => {
      const nameControl = component.formGroup.get('inputName');
      expect(nameControl?.value).toBe('Test Owner From History');
    });

    it('should handle empty history state', () => {
      // Create component with empty history
      Object.defineProperty(window, 'history', {
        value: { state: { bean: {} } },
        writable: true,
        configurable: true,
      });

      const newFixture = TestUtils.createFixture(OwnerUpdateComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.beanFromHistory).toBeInstanceOf(Owner);
      expect(newComponent.beanFromHistory.name).toBe(''); // Default empty value
    });

    it('should handle missing history state', () => {
      // Create component with no history state
      Object.defineProperty(window, 'history', {
        value: { state: {} },
        writable: true,
        configurable: true,
      });

      const newFixture = TestUtils.createFixture(OwnerUpdateComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.beanFromHistory).toBeInstanceOf(Owner);
      expect(newComponent.beanFromHistory.name).toBe(''); // Default empty value
    });

    it('should use createOwner function for history parsing', () => {
      // Test that createOwner function is used correctly
      const emptyOwner = createOwner();
      expect(emptyOwner).toBeInstanceOf(Owner);
      expect(emptyOwner.name).toBe('');
    });
  });

  // Form integration tests
  describe('Form Integration', () => {
    it('should have form group with correct validators', () => {
      const nameControl = component.formGroup.get('inputName');
      expect(nameControl).toBeDefined();

      // Check required validator
      nameControl?.setValue('');
      expect(nameControl?.hasError('required')).toBe(true);

      // Check minLength validator
      nameControl?.setValue('ab');
      expect(nameControl?.hasError('minlength')).toBe(true);

      // Check valid state
      nameControl?.setValue('Valid Name');
      expect(nameControl?.valid).toBe(true);
    });

    it('should create FormGroup with FormBuilder', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.get('inputName')).toBeDefined();
    });

    it('should pass form group to template', () => {
      fixture.detectChanges();

      const beanUpdatePanel = fixture.debugElement.query(By.css('app-bean-update-panel'));
      expect(beanUpdatePanel.componentInstance.formGroup).toBe(component.formGroup);
    });

    it('should pre-populate form with history data', () => {
      expect(component.formGroup.get('inputName')?.value).toBe('Test Owner From History');
      expect(component.formGroup.valid).toBe(true);
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    it('should handle null/undefined values gracefully', () => {
      const nameControl = component.formGroup.get('inputName');

      // Test null value
      nameControl?.setValue(null);
      const nullOwner = component.createBean();
      expect(nullOwner).toBeInstanceOf(Owner);
      expect(nullOwner.name).toBe(null);

      // Test undefined value
      nameControl?.setValue(undefined);
      const undefinedOwner = component.createBean();
      expect(undefinedOwner).toBeInstanceOf(Owner);
      expect(undefinedOwner.name).toBe(undefined);
    });

    it('should handle very long names', () => {
      const longName = 'A'.repeat(1000);
      component.formGroup.get('inputName')?.setValue(longName);

      const createdOwner = component.createBean();
      expect(createdOwner.name).toBe(longName);
      expect(createdOwner.name.length).toBe(1000);
    });

    it('should handle Unicode characters', () => {
      const unicodeName = 'Owner 测试 🏢 العربية русский';
      component.formGroup.get('inputName')?.setValue(unicodeName);

      const createdOwner = component.createBean();
      expect(createdOwner.name).toBe(unicodeName);
    });

    it('should maintain form state during rapid changes', () => {
      const nameControl = component.formGroup.get('inputName');

      // Rapid value changes
      for (let i = 0; i < 10; i++) {
        nameControl?.setValue(`Updated Owner ${i}`);
        expect(component.formGroup.valid).toBe(true);
      }

      // Final check
      expect(nameControl?.value).toBe('Updated Owner 9');
      expect(component.createBean().name).toBe('Updated Owner 9');
    });

    it('should handle corrupted history data', () => {
      // Test with malformed history state
      Object.defineProperty(window, 'history', {
        value: { state: { bean: 'invalid-data' } },
        writable: true,
        configurable: true,
      });

      const newFixture = TestUtils.createFixture(OwnerUpdateComponent);
      const newComponent = newFixture.componentInstance;

      // Should still create valid Owner object
      expect(newComponent.beanFromHistory).toBeInstanceOf(Owner);
    });
  });

  // Component lifecycle tests
  describe('Component Lifecycle', () => {
    it('should initialize properly in constructor', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.beanUpdateService).toBeDefined();
      expect(component.beanFromHistory).toBeDefined();
    });

    it('should maintain state after multiple detections', () => {
      const testName = 'Lifecycle Test Owner';
      component.formGroup.get('inputName')?.setValue(testName);

      // Multiple change detections
      for (let i = 0; i < 5; i++) {
        fixture.detectChanges();
      }

      expect(component.formGroup.get('inputName')?.value).toBe(testName);
      expect(component.createBean().name).toBe(testName);
    });

    it('should handle component reinitialization', () => {
      const originalFormGroup = component.formGroup;
      const originalService = component.beanUpdateService;
      const originalBeanFromHistory = component.beanFromHistory;

      // Component should maintain its state
      expect(component.formGroup).toBe(originalFormGroup);
      expect(component.beanUpdateService).toBe(originalService);
      expect(component.beanFromHistory).toBe(originalBeanFromHistory);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have autoFocus on name input', () => {
      const inputField = fixture.debugElement.query(By.css('app-input-field'));
      expect(inputField.componentInstance.autoFocus).toBe(true);
    });

    it('should have proper label for input field', () => {
      const inputField = fixture.debugElement.query(By.css('app-input-field'));
      expect(inputField.componentInstance.label).toBe('Name');
    });

    it('should be keyboard accessible through form controls', () => {
      const nameControl = component.formGroup.get('inputName');
      expect(nameControl).toBeDefined();

      // Form should be navigable
      expect(component.formGroup.get('inputName')).toBeTruthy();
    });
  });

  // Configuration tests
  describe('Configuration', () => {
    it('should have correct bean and router names', () => {
      fixture.detectChanges();

      const beanUpdatePanel = fixture.debugElement.query(By.css('app-bean-update-panel'));
      const panelComponent = beanUpdatePanel.componentInstance;

      expect(panelComponent.beanName).toBe('Owner');
      expect(panelComponent.routerName).toBe('owners');
    });

    it('should use correct form control names', () => {
      expect(component.formGroup.get('inputName')).toBeDefined();
      expect(component.formGroup.get('inputName')?.value).toBeDefined();
    });

    it('should have consistent component configuration', () => {
      expect(component.constructor.name).toBe('OwnerUpdateComponent');
    });

    it('should pass beanFromHistory to BeanUpdatePanel', () => {
      fixture.detectChanges();

      const beanUpdatePanel = fixture.debugElement.query(By.css('app-bean-update-panel'));
      expect(beanUpdatePanel.componentInstance.beanFromHistory).toBe(component.beanFromHistory);
      expect(beanUpdatePanel.componentInstance.beanFromHistory.name).toBe(
        'Test Owner From History',
      );
    });
  });

  // Data consistency tests
  describe('Data Consistency', () => {
    it('should maintain consistency between beanFromHistory and form', () => {
      // Initially should be consistent
      expect(component.beanFromHistory.name).toBe('Test Owner From History');
      expect(component.formGroup.get('inputName')?.value).toBe('Test Owner From History');

      // When form changes, createBean should reflect changes, not beanFromHistory
      component.formGroup.get('inputName')?.setValue('Modified Name');
      const newOwner = component.createBean();

      expect(newOwner.name).toBe('Modified Name');
      expect(component.beanFromHistory.name).toBe('Test Owner From History'); // Should remain unchanged
    });

    it('should preserve original data in beanFromHistory', () => {
      const originalName = component.beanFromHistory.name;

      // Change form multiple times
      component.formGroup.get('inputName')?.setValue('Change 1');
      component.formGroup.get('inputName')?.setValue('Change 2');
      component.formGroup.get('inputName')?.setValue('Change 3');

      // beanFromHistory should not change
      expect(component.beanFromHistory.name).toBe(originalName);
    });

    it('should create new Owner instances from createBean', () => {
      const owner1 = component.createBean();
      const owner2 = component.createBean();

      // Should be different instances
      expect(owner1).not.toBe(owner2);
      expect(owner1).not.toBe(component.beanFromHistory);

      // But with same data
      expect(owner1.name).toBe(owner2.name);
    });
  });
});
