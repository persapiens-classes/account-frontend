import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';
import { ControlValueAccessor } from '@angular/forms';
import { InputFieldComponent } from './input-field.component';
import { By } from '@angular/platform-browser';
import { TestUtils, createMockNgControl } from '../shared/test-utils';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;
  let mockNgControl: ReturnType<typeof createMockNgControl>;

  beforeEach(async () => {
    mockNgControl = createMockNgControl();
    await TestUtils.setupTestBed(InputFieldComponent, mockNgControl);
    fixture = TestUtils.createFixture(InputFieldComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create and initialize with default values', () => {
      TestUtils.testBasicInitialization(
        component,
        {
          id: 'id',
          name: 'name',
          label: '',
          autoFocus: false,
          value: '',
          isDisabled: false,
        },
        InputFieldComponent,
      );
    });

    it('should have onChange and onTouched functions', () => {
      expect(typeof component.onChange).toBe('function');
      expect(typeof component.onTouched).toBe('function');
    });
  });

  describe('Input Properties', () => {
    it('should accept basic input properties', () => {
      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'id', testValue: 'test-input-field' },
        { key: 'name', testValue: 'testInputField' },
        { key: 'autoFocus', testValue: true },
      ]);
    });

    it('should accept label and render correctly', () => {
      TestUtils.testLabelRendering(component, fixture, 'Full Name', 'full-name-field');
    });

    it('should bind id to input element', () => {
      const testId = 'test-input-field';
      component.id = testId;
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.id).toBe(testId);
    });
  });

  describe('Template Rendering', () => {
    it('should render p-float-label component', () => {
      TestUtils.testFloatLabelPresence(fixture);
    });

    it('should render the input element with pInputText directive', () => {
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input[pInputText]');
      expect(inputElement).toBeTruthy();
    });

    it('should bind input value correctly', () => {
      component.writeValue('Test Value');
      fixture.detectChanges();
      expect(component.value).toBe('Test Value');
    });

    it('should handle validation errors', async () => {
      await TestUtils.testValidationErrorsAsync(component, mockNgControl, 'Test Field', fixture);
    });

    it('should manage disabled state', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should implement ControlValueAccessor interface', () => {
      TestUtils.testControlValueAccessor(component, 'Test Input Value');
    });

    it('should handle null and undefined values', () => {
      // Test via the ControlValueAccessor interface which accepts any
      (component as ControlValueAccessor).writeValue(null);
      expect(component.value).toBe('');

      (component as ControlValueAccessor).writeValue(undefined);
      expect(component.value).toBe('');
    });
  });

  describe('Event Handling', () => {
    it('should call onChange when ngModelChange is triggered', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(By.css('input'));
      const newValue = 'Updated Value';

      inputElement.triggerEventHandler('ngModelChange', newValue);

      expect(mockOnChange).toHaveBeenCalledWith(newValue);
    });

    it('should call onTouched when input is blurred', () => {
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.triggerEventHandler('blur', {});

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should update component value when user types', () => {
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector('input') as HTMLInputElement;
      const newValue = 'User Input';

      inputElement.value = newValue;
      inputElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.value).toBe(newValue);

      // Note: The actual value update depends on ngModel binding
      // In a real scenario, this would be tested with reactive forms or template-driven forms
    });
  });

  describe('Integration with NgControl', () => {
    it('should integrate with NgControl properly', () => {
      TestUtils.testNgControlIntegration(component);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      component.writeValue('');
      expect(component.value).toBe('');
    });

    it('should handle whitespace-only values', () => {
      const whitespaceValue = '   ';
      component.writeValue(whitespaceValue);
      expect(component.value).toBe(whitespaceValue);
    });

    it('should handle very long text values', () => {
      const longValue = 'A'.repeat(1000);
      component.writeValue(longValue);
      expect(component.value).toBe(longValue);
    });

    it('should work with empty label', () => {
      component.label = '';
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('label');
      expect(label.textContent.trim()).toBe('');
    });

    it('should handle multiple validation errors', () => {
      component.label = 'Test Field';
      mockNgControl.invalid = true;
      mockNgControl.touched = true;
      mockNgControl.dirty = true;
      mockNgControl.errors = { required: true, minlength: true };
      fixture.detectChanges();

      const alertDiv = fixture.nativeElement.querySelector('.alert');
      expect(alertDiv).toBeTruthy();
      expect(alertDiv.textContent).toContain('Test Field is required.');
      expect(alertDiv.textContent).toContain('Test Field must be at least 3 characters long.');
    });

    it('should handle special characters in input', () => {
      const specialValue = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      component.writeValue(specialValue);
      expect(component.value).toBe(specialValue);
    });

    it('should handle unicode characters', () => {
      const unicodeValue = '测试 テスト тест';
      component.writeValue(unicodeValue);
      expect(component.value).toBe(unicodeValue);
    });
  });

  describe('Component State Management', () => {
    it('should manage component state correctly', () => {
      TestUtils.testStateManagement(component, 'First Value', 'Second Value');
    });

    it('should preserve input properties after changes', () => {
      component.id = 'custom-id';
      component.name = 'custom-name';
      component.label = 'Custom Label';
      component.autoFocus = true;

      fixture.detectChanges();

      expect(component.id).toBe('custom-id');
      expect(component.name).toBe('custom-name');
      expect(component.label).toBe('Custom Label');
      expect(component.autoFocus).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should support accessibility features', () => {
      TestUtils.testAccessibility(component, fixture, 'user-name', 'User Name');
    });

    it('should handle label-input association', () => {
      component.id = 'user-name';
      component.label = 'User Name';
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('label');
      const input = fixture.nativeElement.querySelector('input');

      expect(label.getAttribute('for')).toBe('user-name');
      expect(input.id).toBe('user-name');
    });

    it('should be accessible when disabled', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should work with reactive forms pattern', async () => {
      await TestUtils.testFormIntegrationAsync(
        component,
        'Form Value',
        mockNgControl,
        'Required Field',
        fixture,
      );
    });
  });
});
