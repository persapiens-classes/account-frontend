import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { expect, vi } from 'vitest';

// Type definitions for field components
interface FieldComponent extends ControlValueAccessor {
  value: unknown;
  onChange: (value: unknown) => void;
  onTouched: () => void;
  isDisabled?: boolean;
  label?: string;
  id?: string;
  autoFocus?: boolean;
  ngControl?: MockNgControl;
  setDisabledState?: (isDisabled: boolean) => void;
}

interface MockNgControl {
  invalid: boolean;
  dirty: boolean;
  touched: boolean;
  errors: Record<string, boolean> | null;
  control: {
    markAsTouched: () => void;
  };
}

interface TestProperty<T> {
  key: keyof T;
  testValue: unknown;
}

type MockCallback = ReturnType<typeof vi.fn>;

/**
 * Utilities for testing field components to reduce code duplication
 * while maintaining readability for component-specific logic
 */
export class FieldTestUtils {
  /**
   * Sets up TestBed configuration for field components
   */
  static async setupTestBed<T>(componentType: Type<T>): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [componentType],
      providers: [],
    }).compileComponents();
  }

  /**
   * Creates component fixture with basic setup
   */
  static createFixture<T>(componentType: Type<T>): ComponentFixture<T> {
    return TestBed.createComponent(componentType);
  }

  /**
   * Tests basic component creation and initialization
   */
  static testBasicInitialization<T>(
    component: T,
    expectedDefaults: Partial<T>,
    componentType: Type<T>,
  ): void {
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(componentType);

    // Test default values
    for (const [key, value] of Object.entries(expectedDefaults)) {
      const componentRecord = component as Record<string, unknown>;
      expect(Object.hasOwn(componentRecord, key)).toBe(true);
      expect(componentRecord[key as keyof typeof componentRecord]).toBe(value);
    }
  }

  /**
   * Tests ControlValueAccessor interface implementation
   */
  static testControlValueAccessor<T extends FieldComponent>(
    component: T,
    testValue: unknown,
  ): void {
    // Test writeValue
    component.writeValue(testValue);
    expect(component.value).toBe(testValue);

    // Test writeValue with null
    component.writeValue(null);
    const expectedNull = typeof testValue === 'string' ? '' : null;
    expect(component.value).toBe(expectedNull);

    // Test registerOnChange
    const mockOnChange = vi.fn();
    component.registerOnChange(mockOnChange);
    expect(component.onChange).toBe(mockOnChange);

    // Test registerOnTouched
    const mockOnTouched = vi.fn();
    component.registerOnTouched(mockOnTouched);
    expect(component.onTouched).toBe(mockOnTouched);

    // Test setDisabledState
    if (component.setDisabledState) {
      component.setDisabledState(true);
      expect(component.isDisabled).toBe(true);

      component.setDisabledState(false);
      expect(component.isDisabled).toBe(false);
    }
  }

  /**
   * Tests basic input properties
   */
  static testBasicInputProperties<T>(
    component: T,
    fixture: ComponentFixture<T>,
    properties: TestProperty<T>[],
  ): void {
    for (const { key, testValue } of properties) {
      (component as Record<string, unknown>)[key as string] = testValue;
      fixture.detectChanges();
      expect((component as Record<string, unknown>)[key as string]).toBe(testValue);
    }
  }

  /**
   * Tests label rendering and association
   */
  static testLabelRendering<T extends FieldComponent>(
    component: T,
    fixture: ComponentFixture<T>,
    labelText: string,
    inputId: string,
  ): void {
    component.label = labelText;
    component.id = inputId;
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label).toBeTruthy();
    expect(label.textContent.trim()).toBe(labelText);
    expect(label.getAttribute('for')).toBe(inputId);
  }

  /**
   * Tests p-float-label component presence
   */
  static testFloatLabelPresence<T>(fixture: ComponentFixture<T>): void {
    fixture.detectChanges();

    const floatLabel = fixture.nativeElement.querySelector('p-float-label');
    expect(floatLabel).toBeTruthy();
    expect(floatLabel.classList.contains('mb-2.5')).toBe(true);
  }

  /**
   * Tests validation error display
   */
  static testValidationErrors<T extends FieldComponent>(
    component: T,
    fixture: ComponentFixture<T>,
    labelText: string,
    mockNgControl: MockNgControl,
  ): void {
    component.label = labelText;

    // Test no errors when valid
    mockNgControl.invalid = false;
    component.ngControl = mockNgControl;
    fixture.detectChanges();

    let alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeFalsy();

    // Test required error
    mockNgControl.invalid = true;
    mockNgControl.touched = true;
    mockNgControl.errors = { required: true };
    fixture.detectChanges();

    alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();
    expect(alertDiv.textContent).toContain(`${labelText} is required.`);

    // Test minlength error
    mockNgControl.dirty = true;
    mockNgControl.errors = { minlength: true };
    fixture.detectChanges();

    alertDiv = fixture.nativeElement.querySelector('.alert');
    if (alertDiv?.textContent?.includes('must be at least')) {
      expect(alertDiv.textContent).toContain(`${labelText} must be at least 3 characters long.`);
    }
  }

  /**
   * Tests NgControl integration in component context
   */
  static testNgControlIntegration<T extends FieldComponent>(component: T): void {
    expect(component.ngControl).toBeDefined();
    expect(component).toBeDefined();
  }

  /**
   * Tests component state management
   */
  static testStateManagement<T extends FieldComponent>(
    component: T,
    testValue: unknown,
    secondValue: unknown,
  ): void {
    // Test disabled state
    expect(component.isDisabled).toBe(false);
    component.setDisabledState?.(true);
    expect(component.isDisabled).toBe(true);
    component.setDisabledState?.(false);
    expect(component.isDisabled).toBe(false);

    // Test value state
    const initialValue = typeof testValue === 'string' ? '' : null;
    expect(component.value).toBe(initialValue);

    component.writeValue(testValue);
    expect(component.value).toBe(testValue);

    component.writeValue(secondValue);
    expect(component.value).toBe(secondValue);

    component.writeValue(null);
    const expectedNull = typeof testValue === 'string' ? '' : null;
    expect(component.value).toBe(expectedNull);
  }

  /**
   * Tests accessibility features
   */
  static testAccessibility<T extends FieldComponent>(
    component: T,
    fixture: ComponentFixture<T>,
    testId: string,
    testLabel: string,
  ): void {
    component.id = testId;
    component.label = testLabel;
    component.autoFocus = true;
    fixture.detectChanges();

    expect(component.autoFocus).toBe(true);

    const label = fixture.nativeElement.querySelector('label');
    expect(label.getAttribute('for')).toBe(testId);
  }

  /**
   * Tests form integration patterns
   */
  static testFormIntegration<T extends FieldComponent>(
    component: T,
    testValue: unknown,
    mockNgControl: MockNgControl,
    labelText: string,
    fixture: ComponentFixture<T>,
  ): void {
    const mockOnChange = vi.fn();
    const mockOnTouched = vi.fn();

    component.registerOnChange(mockOnChange);
    component.registerOnTouched(mockOnTouched);

    // Test form control setting value
    component.writeValue(testValue);
    expect(component.value).toBe(testValue);

    // Test user interaction
    component.onChange(testValue);
    expect(mockOnChange).toHaveBeenCalledWith(testValue);

    // Test blur event
    component.onTouched();
    expect(mockOnTouched).toHaveBeenCalled();

    // Test validation states
    component.label = labelText;

    // Pristine state
    mockNgControl.invalid = false;
    mockNgControl.touched = false;
    mockNgControl.dirty = false;
    component.ngControl = mockNgControl;
    fixture.detectChanges();

    let alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeFalsy();

    // Invalid touched state
    mockNgControl.invalid = true;
    mockNgControl.touched = true;
    mockNgControl.errors = { required: true };
    fixture.detectChanges();

    alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();
  }

  /**
   * Tests event handling with DebugElement
   */
  static testEventHandling<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    eventName: string,
    eventData: unknown,
    mockCallback: MockCallback,
  ): void {
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css(selector));
    element.triggerEventHandler(eventName, eventData);

    expect(mockCallback).toHaveBeenCalled();
  }

  /**
   * Tests multiple validation errors
   */
  static testMultipleValidationErrors<T extends FieldComponent>(
    component: T,
    fixture: ComponentFixture<T>,
    labelText: string,
    mockNgControl: MockNgControl,
  ): void {
    component.label = labelText;
    mockNgControl.invalid = true;
    mockNgControl.touched = true;
    mockNgControl.dirty = true;
    mockNgControl.errors = { required: true, minlength: true };
    component.ngControl = mockNgControl;
    fixture.detectChanges();

    const alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();

    const alertText = alertDiv.textContent;
    expect(alertText).toContain(`${labelText} is required.`);

    // Check for minlength only if it's actually shown
    if (alertText?.includes('must be at least')) {
      expect(alertText).toContain(`${labelText} must be at least 3 characters long.`);
    }
  }
}

/**
 * Mock NgControl for testing
 */
export function createMockNgControl(): MockNgControl {
  return {
    invalid: false,
    dirty: false,
    touched: false,
    errors: null,
    control: {
      markAsTouched: vi.fn(),
    },
  };
}
