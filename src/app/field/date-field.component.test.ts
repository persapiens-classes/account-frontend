import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';
import { DateFieldComponent } from './date-field.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FieldTestUtils, createMockNgControl } from './field-test-utils';

describe('DateFieldComponent', () => {
  let component: DateFieldComponent;
  let fixture: ComponentFixture<DateFieldComponent>;
  let mockNgControl: any;

  beforeEach(async () => {
    mockNgControl = createMockNgControl();
    await FieldTestUtils.setupTestBed(DateFieldComponent);
    fixture = FieldTestUtils.createFixture(DateFieldComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create and initialize with default values', () => {
      FieldTestUtils.testBasicInitialization(
        component,
        {
          id: 'id',
          name: 'name',
          label: '',
          autoFocus: false,
          showIcon: true,
          value: null,
          isDisabled: false,
        },
        DateFieldComponent,
      );
    });

    it('should have onChange and onTouched functions', () => {
      expect(typeof component.onChange).toBe('function');
      // onTouched is initially undefined but will be set by registerOnTouched
      expect(component.onTouched).toBeUndefined();

      // Test that it can be set
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);
      expect(component.onTouched).toBe(mockOnTouched);
    });
  });

  describe('Input Properties', () => {
    it('should accept basic input properties', () => {
      FieldTestUtils.testBasicInputProperties(component, fixture, [
        { key: 'id', testValue: 'test-date-field' },
        { key: 'name', testValue: 'testDateField' },
        { key: 'autoFocus', testValue: true },
        { key: 'showIcon', testValue: false },
      ]);
    });

    it('should accept label and render correctly', () => {
      FieldTestUtils.testLabelRendering(component, fixture, 'Birth Date', 'birth-date-field');
    });
  });

  describe('Template Rendering', () => {
    it('should render p-float-label component', () => {
      FieldTestUtils.testFloatLabelPresence(fixture);
    });

    it('should render the p-date-picker component', () => {
      fixture.detectChanges();
      const datePicker = fixture.nativeElement.querySelector('p-date-picker');
      expect(datePicker).toBeTruthy();
    });

    it('should handle validation errors', () => {
      FieldTestUtils.testValidationErrors(component, fixture, 'Test Field', mockNgControl);
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should implement ControlValueAccessor interface', () => {
      const testDate = new Date('2023-12-25');
      FieldTestUtils.testControlValueAccessor(component, testDate);
    });
  });

  describe('Event Handling', () => {
    it('should handle onDateSelect event', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      const testDate = new Date('2023-12-25');
      component.onDateSelect(testDate);

      expect(component.value).toBe(testDate);
      expect(mockOnChange).toHaveBeenCalledWith(testDate);
    });

    it('should call onTouched when date picker is blurred', () => {
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);
      fixture.detectChanges();

      const datePicker = fixture.debugElement.query(By.css('p-date-picker'));
      datePicker.triggerEventHandler('onBlur', {});

      expect(mockOnTouched).toHaveBeenCalled();
    });
  });

  describe('Integration with NgControl', () => {
    it('should integrate with NgControl properly', () => {
      FieldTestUtils.testNgControlIntegration(component);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid date objects', () => {
      const invalidDate = new Date('invalid');
      component.writeValue(invalidDate);

      expect(component.value).toBe(invalidDate);
    });

    it('should handle date selection with invalid date', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      const invalidDate = new Date('invalid');
      component.onDateSelect(invalidDate);

      expect(component.value).toBe(invalidDate);
      expect(mockOnChange).toHaveBeenCalledWith(invalidDate);
    });

    it('should work with empty label', () => {
      component.label = '';
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('label');
      expect(label.textContent.trim()).toBe('');
    });

    it('should handle multiple validation errors', () => {
      FieldTestUtils.testMultipleValidationErrors(component, fixture, 'Test Field', mockNgControl);
    });
  });

  describe('Component State Management', () => {
    it('should manage component state correctly', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-12-31');
      FieldTestUtils.testStateManagement(component, date1, date2);
    });

    it('should handle date selection properly', () => {
      const date2 = new Date('2023-12-31');
      component.onDateSelect(date2);
      expect(component.value).toBe(date2);
    });
  });

  describe('Accessibility', () => {
    it('should support accessibility features', () => {
      FieldTestUtils.testAccessibility(component, fixture, 'birth-date', 'Birth Date');
    });
  });
});
