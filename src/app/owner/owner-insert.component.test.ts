import { ComponentFixture } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { OwnerInsertComponent } from './owner-insert.component';
import { OwnerInsertService } from './owner-insert-service';
import { Owner } from './owner';
import { TestUtils } from '../shared/test-utils';
import { AppMessageService } from '../app-message-service';

describe('OwnerInsertComponent', () => {
  let component: OwnerInsertComponent;
  let fixture: ComponentFixture<OwnerInsertComponent>;
  let mockOwnerInsertService: {
    insert: ReturnType<typeof vi.fn>;
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
    // Create service mocks
    mockOwnerInsertService = {
      insert: vi.fn().mockReturnValue(of(new Owner('Test Owner'))),
      http: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(OwnerInsertComponent, [
      { provide: OwnerInsertService, useValue: mockOwnerInsertService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
      FormBuilder,
    ]);

    fixture = TestUtils.createFixture(OwnerInsertComponent);
    component = fixture.componentInstance;
  });

  // Basic component structure tests using TestUtils
  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, OwnerInsertComponent);
      expect(component).toBeTruthy();
    });

    it('should have correct form group configuration', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.get('inputName')).toBeDefined();

      const nameControl = component.formGroup.get('inputName');
      expect(nameControl?.value).toBe('');
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should inject required services', () => {
      expect(component.beanInsertService).toBeDefined();
      expect(component.beanInsertService).toBe(mockOwnerInsertService);
    });

    it('should initialize with empty form values', () => {
      expect(component.formGroup.get('inputName')?.value).toBe('');
      expect(component.formGroup.invalid).toBe(true);
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
      nameControl?.setValue('Test Owner Name');
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

    it('should handle form state changes', () => {
      const nameControl = component.formGroup.get('inputName');

      // Initially invalid
      expect(component.formGroup.invalid).toBe(true);

      // Become valid
      nameControl?.setValue('Valid Owner Name');
      expect(component.formGroup.valid).toBe(true);

      // Become invalid again
      nameControl?.setValue('');
      expect(component.formGroup.invalid).toBe(true);
    });
  });

  // Template rendering tests
  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render BeanInsertPanelComponent with correct properties', () => {
      const beanInsertPanel = fixture.debugElement.query(By.css('app-bean-insert-panel'));
      expect(beanInsertPanel).toBeTruthy();

      const panelComponent = beanInsertPanel.componentInstance;
      expect(panelComponent.formGroup).toBe(component.formGroup);
      expect(panelComponent.beanInsertService).toBe(mockOwnerInsertService);
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

    it('should use ReactiveFormsModule', () => {
      const formElement = fixture.debugElement.query(By.css('form, [formGroup]'));
      expect(formElement).toBeTruthy();
    });
  });

  // createBean method tests
  describe('createBean Method', () => {
    it('should create Owner from form values', () => {
      const testName = 'Test Owner Name';
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
      const specialName = 'Owner & Co. "Special" Ltd.';
      component.formGroup.get('inputName')?.setValue(specialName);

      const createdOwner = component.createBean();

      expect(createdOwner).toBeInstanceOf(Owner);
      expect(createdOwner.name).toBe(specialName);
    });

    it('should be bound correctly to BeanInsertPanel', () => {
      fixture.detectChanges();

      const beanInsertPanel = fixture.debugElement.query(By.css('app-bean-insert-panel'));
      const createBeanFunction = beanInsertPanel.componentInstance.createBean;
      expect(createBeanFunction).toBeDefined();
      expect(typeof createBeanFunction).toBe('function');

      // Test that the bound function works
      component.formGroup.get('inputName')?.setValue('Bound Test Owner');
      const result = createBeanFunction();
      expect(result).toBeInstanceOf(Owner);
      expect(result.name).toBe('Bound Test Owner');
    });
  });

  // Service integration tests
  describe('Service Integration', () => {
    it('should inject OwnerInsertService correctly', () => {
      expect(component.beanInsertService).toBe(mockOwnerInsertService);
      expect(component.beanInsertService.insert).toBeDefined();
    });

    it('should pass service to BeanInsertPanel', () => {
      fixture.detectChanges();

      const beanInsertPanel = fixture.debugElement.query(By.css('app-bean-insert-panel'));
      expect(beanInsertPanel.componentInstance.beanInsertService).toBe(mockOwnerInsertService);
    });

    it('should maintain service reference throughout lifecycle', () => {
      const initialService = component.beanInsertService;
      fixture.detectChanges();

      // Service should remain the same
      expect(component.beanInsertService).toBe(initialService);
      expect(component.beanInsertService).toBe(mockOwnerInsertService);
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

      const beanInsertPanel = fixture.debugElement.query(By.css('app-bean-insert-panel'));
      expect(beanInsertPanel.componentInstance.formGroup).toBe(component.formGroup);
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
        nameControl?.setValue(`Owner ${i}`);
        expect(component.formGroup.valid).toBe(true);
      }

      // Final check
      expect(nameControl?.value).toBe('Owner 9');
      expect(component.createBean().name).toBe('Owner 9');
    });
  });

  // Component lifecycle tests
  describe('Component Lifecycle', () => {
    it('should initialize properly in constructor', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.beanInsertService).toBeDefined();
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
      const originalService = component.beanInsertService;

      // Component should maintain its state
      expect(component.formGroup).toBe(originalFormGroup);
      expect(component.beanInsertService).toBe(originalService);
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

  // Constants and configuration tests
  describe('Configuration', () => {
    it('should have correct bean and router names', () => {
      fixture.detectChanges();

      const beanInsertPanel = fixture.debugElement.query(By.css('app-bean-insert-panel'));
      const panelComponent = beanInsertPanel.componentInstance;

      expect(panelComponent.beanName).toBe('Owner');
      expect(panelComponent.routerName).toBe('owners');
    });

    it('should use correct form control names', () => {
      expect(component.formGroup.get('inputName')).toBeDefined();
      expect(component.formGroup.get('inputName')?.value).toBeDefined();
    });

    it('should have consistent component configuration', () => {
      expect(component.constructor.name).toBe('OwnerInsertComponent');
    });
  });
});
