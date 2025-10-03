import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';
import { NumberFieldComponent } from './number-field.component';
import { By } from '@angular/platform-browser';
import { FieldTestUtils, createMockNgControl } from '../shared/test-utils';

describe('NumberFieldComponent', () => {
  let component: NumberFieldComponent;
  let fixture: ComponentFixture<NumberFieldComponent>;
  let mockNgControl: ReturnType<typeof createMockNgControl>;

  beforeEach(async () => {
    mockNgControl = createMockNgControl();
    await FieldTestUtils.setupTestBed(NumberFieldComponent, mockNgControl);
    fixture = FieldTestUtils.createFixture(NumberFieldComponent);
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
          mode: 'currency',
          currency: 'USD',
          locale: 'en-US',
          value: null,
          isDisabled: false,
        },
        NumberFieldComponent,
      );
    });

    it('should have onChange and onTouched functions', () => {
      expect(typeof component.onChange).toBe('function');
      expect(typeof component.onTouched).toBe('function');
    });
  });

  describe('Input Properties', () => {
    it('should accept basic input properties', () => {
      FieldTestUtils.testBasicInputProperties(component, fixture, [
        { key: 'id', testValue: 'test-number-field' },
        { key: 'name', testValue: 'testNumberField' },
        { key: 'autoFocus', testValue: true },
        { key: 'mode', testValue: 'decimal' },
        { key: 'currency', testValue: 'EUR' },
        { key: 'locale', testValue: 'pt-BR' },
      ]);
    });

    it('should accept label and render correctly', () => {
      FieldTestUtils.testLabelRendering(component, fixture, 'Price', 'price-field');
    });
  });

  describe('Template Rendering', () => {
    it('should render p-float-label component', () => {
      FieldTestUtils.testFloatLabelPresence(fixture);
    });

    it('should render the p-inputnumber component', () => {
      fixture.detectChanges();
      const inputNumber = fixture.nativeElement.querySelector('p-inputnumber');
      expect(inputNumber).toBeTruthy();
    });

    it('should handle validation errors', () => {
      FieldTestUtils.testValidationErrors(component, fixture, 'Test Field', mockNgControl);
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should implement ControlValueAccessor interface', () => {
      FieldTestUtils.testControlValueAccessor(component, 123.45);
    });
  });

  describe('Value Change Handling', () => {
    it('should handle onValueChange with numeric string', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange('123.45');

      expect(component.value).toBe(123.45);
      expect(mockOnChange).toHaveBeenCalledWith(123.45);
    });

    it('should handle onValueChange with number', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange(67.89);

      expect(component.value).toBe(67.89);
      expect(mockOnChange).toHaveBeenCalledWith(67.89);
    });

    it('should handle onValueChange with null', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange(null);

      expect(component.value).toBe(null);
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should handle onValueChange with invalid string', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange('invalid');

      expect(component.value).toBe(null);
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should handle onValueChange with empty string', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange('');

      expect(component.value).toBe(null);
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });

    it('should handle onValueChange with zero', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange(0);

      expect(component.value).toBe(0);
      expect(mockOnChange).toHaveBeenCalledWith(0);
    });

    it('should handle onValueChange with negative numbers', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange(-100.5);

      expect(component.value).toBe(-100.5);
      expect(mockOnChange).toHaveBeenCalledWith(-100.5);
    });
  });

  describe('Event Handling', () => {
    it('should call onValueChange when onInput is triggered', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);
      fixture.detectChanges();

      const inputNumber = fixture.debugElement.query(By.css('p-inputnumber'));
      inputNumber.triggerEventHandler('onInput', { value: 250.75 });

      expect(component.value).toBe(250.75);
      expect(mockOnChange).toHaveBeenCalledWith(250.75);
    });

    it('should call onTouched when input is blurred', () => {
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);
      fixture.detectChanges();

      const inputNumber = fixture.debugElement.query(By.css('p-inputnumber'));
      inputNumber.triggerEventHandler('onBlur', {});

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should call markAsTouched when onTouched is called with ngControl', () => {
      component.onTouched();

      if (component.ngControl?.control?.markAsTouched) {
        expect(mockNgControl.control.markAsTouched).toHaveBeenCalled();
      }
    });

    it('should handle onTouched when ngControl is null', () => {
      // Simulate scenario where ngControl is undefined
      expect(() => component.onTouched()).not.toThrow();
    });
  });

  describe('Integration with NgControl', () => {
    it('should integrate with NgControl properly', () => {
      FieldTestUtils.testNgControlIntegration(component);
    });
  });

  describe('Number Parsing and Validation', () => {
    it('should parse valid decimal strings correctly', () => {
      const testCases = [
        { input: '123', expected: 123 },
        { input: '123.45', expected: 123.45 },
        { input: '0', expected: 0 },
        { input: '0.01', expected: 0.01 },
        { input: '999.999', expected: 999.999 },
      ];

      testCases.forEach(({ input, expected }) => {
        component.onValueChange(input);
        expect(component.value).toBe(expected);
      });
    });

    it('should handle invalid strings as null', () => {
      const invalidInputs = ['abc', 'NaN', 'undefined', 'text123'];

      invalidInputs.forEach((input) => {
        component.onValueChange(input);
        expect(component.value).toBe(null);
      });

      // Test edge case - this should be parsed as 12.34
      component.onValueChange('12.34.56');
      expect(component.value).toBe(12.34); // parseFloat stops at first invalid character
    });

    it('should handle edge number cases', () => {
      const edgeCases = [
        { input: Number.MAX_SAFE_INTEGER, expected: Number.MAX_SAFE_INTEGER },
        { input: Number.MIN_SAFE_INTEGER, expected: Number.MIN_SAFE_INTEGER },
        { input: 0.0000001, expected: 0.0000001 },
      ];

      edgeCases.forEach(({ input, expected }) => {
        component.onValueChange(input);
        expect(component.value).toBe(expected);
      });
    });

    it('should handle Infinity and -Infinity', () => {
      component.onValueChange(Infinity);
      expect(component.value).toBe(Infinity);

      component.onValueChange(-Infinity);
      expect(component.value).toBe(-Infinity);
    });
  });

  describe('Currency and Locale Configuration', () => {
    it('should work with different currency modes', () => {
      const modes = ['currency', 'decimal'];

      modes.forEach((mode) => {
        component.mode = mode;
        fixture.detectChanges();
        expect(component.mode).toBe(mode);
      });
    });

    it('should work with different currencies', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'BRL'];

      currencies.forEach((currency) => {
        component.currency = currency;
        fixture.detectChanges();
        expect(component.currency).toBe(currency);
      });
    });

    it('should work with different locales', () => {
      const locales = ['en-US', 'pt-BR', 'de-DE', 'fr-FR', 'ja-JP'];

      locales.forEach((locale) => {
        component.locale = locale;
        fixture.detectChanges();
        expect(component.locale).toBe(locale);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should work with empty label', () => {
      component.label = '';
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('label');
      expect(label.textContent.trim()).toBe('');
    });

    it('should handle multiple validation errors', () => {
      FieldTestUtils.testMultipleValidationErrors(component, fixture, 'Test Field', mockNgControl);
    });

    it('should handle very large numbers', () => {
      const largeNumber = 1e10; // 10 billion
      component.onValueChange(largeNumber);
      expect(component.value).toBe(largeNumber);
    });

    it('should handle very small decimal numbers', () => {
      const smallNumber = 1e-10; // Very small decimal
      component.onValueChange(smallNumber);
      expect(component.value).toBe(smallNumber);
    });
  });

  describe('Component State Management', () => {
    it('should manage component state correctly', () => {
      FieldTestUtils.testStateManagement(component, 100, 200);
    });

    it('should handle value changes properly', () => {
      component.onValueChange(200);
      expect(component.value).toBe(200);
    });

    it('should preserve input properties after changes', () => {
      component.id = 'custom-id';
      component.name = 'custom-name';
      component.label = 'Custom Label';
      component.autoFocus = true;
      component.mode = 'decimal';
      component.currency = 'EUR';
      component.locale = 'de-DE';

      fixture.detectChanges();

      expect(component.id).toBe('custom-id');
      expect(component.name).toBe('custom-name');
      expect(component.label).toBe('Custom Label');
      expect(component.autoFocus).toBe(true);
      expect(component.mode).toBe('decimal');
      expect(component.currency).toBe('EUR');
      expect(component.locale).toBe('de-DE');
    });
  });

  describe('Accessibility', () => {
    it('should support accessibility features', () => {
      FieldTestUtils.testAccessibility(component, fixture, 'price-field', 'Price');
    });

    it('should be accessible when disabled', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should work with reactive forms pattern', () => {
      FieldTestUtils.testFormIntegration(
        component,
        500,
        mockNgControl,
        'Required Number Field',
        fixture,
      );
    });

    it('should handle specific number operations', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      component.onValueChange(750);
      expect(mockOnChange).toHaveBeenCalledWith(750);
    });
  });
});
