import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';
import { SelectFieldComponent } from './select-field.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Bean } from '../bean/bean';
import { FieldTestUtils, createMockNgControl } from './field-test-utils';

// Mock Bean implementation for testing
class MockBean implements Bean {
  constructor(private id: string, public name: string) {}
  
  getId(): string {
    return this.id;
  }
}

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;
  let mockNgControl: any;
  let mockBeans: Bean[];

  beforeEach(async () => {
    mockNgControl = createMockNgControl();
    mockBeans = [
      new MockBean('1', 'Option 1'),
      new MockBean('2', 'Option 2'),
      new MockBean('3', 'Option 3'),
    ];

    await FieldTestUtils.setupTestBed(SelectFieldComponent);
    fixture = FieldTestUtils.createFixture(SelectFieldComponent);
    component = fixture.componentInstance;
    component.options = mockBeans;
  });

  describe('Component Initialization', () => {
    it('should create and initialize with default values', () => {
      FieldTestUtils.testBasicInitialization(component, {
        id: 'id',
        name: 'name',
        label: '',
        placeholder: '',
        autoFocus: false,
        optionLabel: '',
        value: null,
        isDisabled: false
      }, SelectFieldComponent);
    });

    it('should have onChange and onTouched functions', () => {
      expect(typeof component.onChange).toBe('function');
      expect(typeof component.onTouched).toBe('function');
    });

    it('should require options to be provided', () => {
      expect(component.options).toBeDefined();
    });
  });

  describe('Input Properties', () => {
    it('should accept basic input properties', () => {
      FieldTestUtils.testBasicInputProperties(component, fixture, [
        { key: 'id', testValue: 'test-select-field' },
        { key: 'name', testValue: 'testSelectField' },
        { key: 'placeholder', testValue: 'Select an option...' },
        { key: 'autoFocus', testValue: true },
        { key: 'optionLabel', testValue: 'name' }
      ]);
    });

    it('should accept label and render correctly', () => {
      FieldTestUtils.testLabelRendering(component, fixture, 'Choose Option', 'choose-option-field');
    });

    it('should accept options input property', () => {
      const newOptions = [new MockBean('4', 'Option 4')];
      component.options = newOptions;
      fixture.detectChanges();

      expect(component.options).toBe(newOptions);
      expect(component.options.length).toBe(1);
    });
  });

  describe('Template Rendering', () => {
    it('should render p-float-label component', () => {
      FieldTestUtils.testFloatLabelPresence(fixture);
    });

    it('should render the p-select component', () => {
      fixture.detectChanges();
      const selectElement = fixture.nativeElement.querySelector('p-select');
      expect(selectElement).toBeTruthy();
    });

    it('should apply correct CSS classes to p-select', () => {
      fixture.detectChanges();
      const selectElement = fixture.nativeElement.querySelector('p-select');
      expect(selectElement.classList.contains('min-w-[200px]')).toBe(true);
      expect(selectElement.classList.contains('max-w-[300px]')).toBe(true);
      expect(selectElement.classList.contains('w-full')).toBe(true);
    });

    it('should handle validation errors (select-specific)', () => {
      // Test basic validation
      FieldTestUtils.testValidationErrors(component, fixture, 'Test Field', mockNgControl);
    });

    it('should show alert div but not minlength error message for select', () => {
      component.label = 'Test Field';
      mockNgControl.invalid = true;
      mockNgControl.dirty = true;
      mockNgControl.errors = { minlength: true };
      component.ngControl = mockNgControl;
      fixture.detectChanges();

      const alertDiv = fixture.nativeElement.querySelector('.alert');
      expect(alertDiv).toBeTruthy(); // Alert div exists
      expect(alertDiv.textContent.includes('must be at least')).toBe(false); // But no minlength message
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should implement ControlValueAccessor interface', () => {
      const testBean = mockBeans[0];
      FieldTestUtils.testControlValueAccessor(component, testBean);
    });
  });

  describe('Selection Handling', () => {
    it('should handle onSelect event', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);
      
      const selectedBean = mockBeans[1];
      component.onSelect(selectedBean);

      expect(component.value).toBe(selectedBean);
      expect(mockOnChange).toHaveBeenCalledWith(selectedBean);
    });

    it('should handle selection change through template event', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      const selectedBean = mockBeans[2];
      
      selectElement.triggerEventHandler('onChange', { value: selectedBean });

      expect(component.value).toBe(selectedBean);
      expect(mockOnChange).toHaveBeenCalledWith(selectedBean);
    });

    it('should call onTouched when select is blurred', () => {
      const mockOnTouched = vi.fn();
      component.registerOnTouched(mockOnTouched);
      fixture.detectChanges();

      const selectElement = fixture.debugElement.query(By.css('p-select'));
      selectElement.triggerEventHandler('onBlur', {});

      expect(mockOnTouched).toHaveBeenCalled();
    });
  });

  describe('Options Handling', () => {
    it('should work with empty options array', () => {
      component.options = [];
      fixture.detectChanges();

      expect(component.options).toEqual([]);
    });

    it('should work with single option', () => {
      const singleOption = [new MockBean('single', 'Single Option')];
      component.options = singleOption;
      fixture.detectChanges();

      expect(component.options.length).toBe(1);
      expect(component.options[0].getId()).toBe('single');
    });

    it('should work with multiple options', () => {
      const multipleOptions = [
        new MockBean('1', 'First'),
        new MockBean('2', 'Second'),
        new MockBean('3', 'Third'),
        new MockBean('4', 'Fourth'),
      ];
      component.options = multipleOptions;
      fixture.detectChanges();

      expect(component.options.length).toBe(4);
      expect(component.options.map(o => o.getId())).toEqual(['1', '2', '3', '4']);
    });

    it('should handle options with optionLabel', () => {
      component.optionLabel = 'name';
      component.options = mockBeans;
      fixture.detectChanges();

      expect(component.optionLabel).toBe('name');
      expect(component.options.every(option => (option as any).name)).toBe(true);
    });
  });

  describe('Integration with NgControl', () => {
    it('should integrate with NgControl properly', () => {
      FieldTestUtils.testNgControlIntegration(component);
    });
  });

  describe('Bean Interface Compliance', () => {
    it('should work with objects implementing Bean interface', () => {
      const customBean = new MockBean('custom', 'Custom Bean');
      component.writeValue(customBean);

      expect(component.value).toBe(customBean);
      expect(component.value?.getId()).toBe('custom');
    });

    it('should handle selection of different Bean implementations', () => {
      class AnotherBean implements Bean {
        constructor(private id: string, public description: string) {}
        getId(): string { return this.id; }
      }

      const anotherBean = new AnotherBean('another', 'Another Bean');
      const mixedOptions = [...mockBeans, anotherBean];
      
      component.options = mixedOptions;
      component.onSelect(anotherBean);

      expect(component.value).toBe(anotherBean);
      expect(component.value?.getId()).toBe('another');
    });
  });

  describe('Edge Cases', () => {
    it('should work with empty label', () => {
      component.label = '';
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('label');
      expect(label.textContent.trim()).toBe('');
    });

    it('should handle null selection', () => {
      component.writeValue(mockBeans[0]); // First set a value
      expect(component.value).toBe(mockBeans[0]);

      component.writeValue(null); // Then clear it
      expect(component.value).toBe(null);
    });

    it('should handle selection and deselection', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);

      // Select
      component.onSelect(mockBeans[0]);
      expect(component.value).toBe(mockBeans[0]);
      expect(mockOnChange).toHaveBeenCalledWith(mockBeans[0]);

      // Clear selection
      component.writeValue(null);
      expect(component.value).toBe(null);
    });

    it('should handle empty optionLabel', () => {
      component.optionLabel = '';
      fixture.detectChanges();

      expect(component.optionLabel).toBe('');
    });

    it('should work without placeholder', () => {
      component.placeholder = '';
      fixture.detectChanges();

      expect(component.placeholder).toBe('');
    });
  });

  describe('Component State Management', () => {
    it('should manage component state correctly', () => {
      FieldTestUtils.testStateManagement(component, mockBeans[0], mockBeans[1]);
    });

    it('should handle selection properly', () => {
      component.onSelect(mockBeans[1]);
      expect(component.value).toBe(mockBeans[1]);
    });

    it('should preserve input properties after changes', () => {
      component.id = 'custom-select';
      component.name = 'customSelect';
      component.label = 'Custom Select';
      component.placeholder = 'Choose...';
      component.autoFocus = true;
      component.optionLabel = 'displayName';
      
      fixture.detectChanges();
      
      expect(component.id).toBe('custom-select');
      expect(component.name).toBe('customSelect');
      expect(component.label).toBe('Custom Select');
      expect(component.placeholder).toBe('Choose...');
      expect(component.autoFocus).toBe(true);
      expect(component.optionLabel).toBe('displayName');
    });
  });

  describe('Accessibility', () => {
    it('should support accessibility features', () => {
      FieldTestUtils.testAccessibility(component, fixture, 'category-select', 'Category');
    });

    it('should be accessible when disabled', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should work with reactive forms pattern', () => {
      FieldTestUtils.testFormIntegration(component, mockBeans[0], mockNgControl, 'Required Select Field', fixture);
    });

    it('should handle specific selection operations', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);
      
      component.onSelect(mockBeans[1]);
      expect(mockOnChange).toHaveBeenCalledWith(mockBeans[1]);
    });

    it('should handle form reset scenarios', () => {
      // Set initial value
      component.writeValue(mockBeans[0]);
      expect(component.value).toBe(mockBeans[0]);
      
      // Simulate form reset
      component.writeValue(null);
      expect(component.value).toBe(null);
      
      // Ensure component still works after reset
      component.onSelect(mockBeans[2]);
      expect(component.value).toBe(mockBeans[2]);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle large option sets efficiently', () => {
      const largeOptionSet = Array.from({ length: 1000 }, (_, i) => 
        new MockBean(`id-${i}`, `Option ${i}`)
      );
      
      component.options = largeOptionSet;
      fixture.detectChanges();
      
      expect(component.options.length).toBe(1000);
      
      // Test selection with large dataset
      const selectedOption = largeOptionSet[500];
      component.onSelect(selectedOption);
      expect(component.value).toBe(selectedOption);
    });

    it('should handle rapid selection changes', () => {
      const mockOnChange = vi.fn();
      component.registerOnChange(mockOnChange);
      
      // Rapidly change selections
      for (let i = 0; i < mockBeans.length; i++) {
        component.onSelect(mockBeans[i]);
      }
      
      expect(mockOnChange).toHaveBeenCalledTimes(mockBeans.length);
      expect(component.value).toBe(mockBeans[mockBeans.length - 1]);
    });
  });
});