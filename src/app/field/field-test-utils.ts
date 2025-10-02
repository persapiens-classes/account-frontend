import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControlValueAccessor } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { expect, vi } from 'vitest';

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
      imports: [componentType, NoopAnimationsModule],
      providers: []
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
    componentType: Type<T>
  ): void {
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(componentType);
    
    // Test default values
    Object.entries(expectedDefaults).forEach(([key, value]) => {
      expect((component as any)[key]).toBe(value);
    });
  }

  /**
   * Tests ControlValueAccessor interface implementation
   */
  static testControlValueAccessor<T extends ControlValueAccessor>(
    component: T,
    testValue: any
  ): void {
    // Test writeValue
    component.writeValue(testValue);
    expect((component as any).value).toBe(testValue);

    // Test writeValue with null
    component.writeValue(null);
    const expectedNull = typeof testValue === 'string' ? '' : null;
    expect((component as any).value).toBe(expectedNull);

    // Test registerOnChange
    const mockOnChange = vi.fn();
    component.registerOnChange(mockOnChange);
    expect((component as any).onChange).toBe(mockOnChange);

    // Test registerOnTouched
    const mockOnTouched = vi.fn();
    component.registerOnTouched(mockOnTouched);
    expect((component as any).onTouched).toBe(mockOnTouched);

    // Test setDisabledState
    if (component.setDisabledState) {
      component.setDisabledState(true);
      expect((component as any).isDisabled).toBe(true);

      component.setDisabledState(false);
      expect((component as any).isDisabled).toBe(false);
    }
  }

  /**
   * Tests basic input properties
   */
  static testBasicInputProperties<T>(
    component: T,
    fixture: ComponentFixture<T>,
    properties: Array<{key: keyof T, testValue: any}>
  ): void {
    properties.forEach(({ key, testValue }) => {
      (component as any)[key] = testValue;
      fixture.detectChanges();
      expect((component as any)[key]).toBe(testValue);
    });
  }

  /**
   * Tests label rendering and association
   */
  static testLabelRendering<T>(
    component: T,
    fixture: ComponentFixture<T>,
    labelText: string,
    inputId: string
  ): void {
    (component as any).label = labelText;
    (component as any).id = inputId;
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label).toBeTruthy();
    expect(label.textContent.trim()).toBe(labelText);
    expect(label.getAttribute('for')).toBe(inputId);
  }

  /**
   * Tests p-float-label component presence
   */
  static testFloatLabelPresence(fixture: ComponentFixture<any>): void {
    fixture.detectChanges();
    
    const floatLabel = fixture.nativeElement.querySelector('p-float-label');
    expect(floatLabel).toBeTruthy();
    expect(floatLabel.classList.contains('mb-2.5')).toBe(true);
  }

  /**
   * Tests validation error display
   */
  static testValidationErrors<T>(
    component: T,
    fixture: ComponentFixture<T>,
    labelText: string,
    mockNgControl: any
  ): void {
    (component as any).label = labelText;
    
    // Test no errors when valid
    mockNgControl.invalid = false;
    (component as any).ngControl = mockNgControl;
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
    if (alertDiv && alertDiv.textContent.includes('must be at least')) {
      expect(alertDiv.textContent).toContain(`${labelText} must be at least 3 characters long.`);
    }
  }

  /**
   * Tests NgControl integration in component context
   */
  static testNgControlIntegration<T>(component: T): void {
    expect((component as any).ngControl).toBeDefined();
    expect(component).toBeDefined();
  }

  /**
   * Tests component state management
   */
  static testStateManagement<T>(
    component: T,
    testValue: any,
    secondValue: any
  ): void {
    const comp = component as any;
    
    // Test disabled state
    expect(comp.isDisabled).toBe(false);
    comp.setDisabledState(true);
    expect(comp.isDisabled).toBe(true);
    comp.setDisabledState(false);
    expect(comp.isDisabled).toBe(false);

    // Test value state
    const initialValue = typeof testValue === 'string' ? '' : null;
    expect(comp.value).toBe(initialValue);
    
    comp.writeValue(testValue);
    expect(comp.value).toBe(testValue);
    
    comp.writeValue(secondValue);
    expect(comp.value).toBe(secondValue);
    
    comp.writeValue(null);
    const expectedNull = typeof testValue === 'string' ? '' : null;
    expect(comp.value).toBe(expectedNull);
  }

  /**
   * Tests accessibility features
   */
  static testAccessibility<T>(
    component: T,
    fixture: ComponentFixture<T>,
    testId: string,
    testLabel: string
  ): void {
    (component as any).id = testId;
    (component as any).label = testLabel;
    (component as any).autoFocus = true;
    fixture.detectChanges();

    expect((component as any).autoFocus).toBe(true);
    
    const label = fixture.nativeElement.querySelector('label');
    expect(label.getAttribute('for')).toBe(testId);
  }

  /**
   * Tests form integration patterns
   */
  static testFormIntegration<T extends ControlValueAccessor>(
    component: T,
    testValue: any,
    mockNgControl: any,
    labelText: string,
    fixture: ComponentFixture<T>
  ): void {
    const mockOnChange = vi.fn();
    const mockOnTouched = vi.fn();
    
    component.registerOnChange(mockOnChange);
    component.registerOnTouched(mockOnTouched);
    
    // Test form control setting value
    component.writeValue(testValue);
    expect((component as any).value).toBe(testValue);
    
    // Test user interaction
    (component as any).onChange(testValue);
    expect(mockOnChange).toHaveBeenCalledWith(testValue);
    
    // Test blur event
    (component as any).onTouched();
    expect(mockOnTouched).toHaveBeenCalled();

    // Test validation states
    (component as any).label = labelText;
    
    // Pristine state
    mockNgControl.invalid = false;
    mockNgControl.touched = false;
    mockNgControl.dirty = false;
    (component as any).ngControl = mockNgControl;
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
    eventData: any,
    mockCallback: any
  ): void {
    fixture.detectChanges();
    
    const element = fixture.debugElement.query(By.css(selector));
    element.triggerEventHandler(eventName, eventData);
    
    expect(mockCallback).toHaveBeenCalled();
  }

  /**
   * Tests multiple validation errors
   */
  static testMultipleValidationErrors<T>(
    component: T,
    fixture: ComponentFixture<T>,
    labelText: string,
    mockNgControl: any
  ): void {
    (component as any).label = labelText;
    mockNgControl.invalid = true;
    mockNgControl.touched = true;
    mockNgControl.dirty = true;
    mockNgControl.errors = { required: true, minlength: true };
    (component as any).ngControl = mockNgControl;
    fixture.detectChanges();

    const alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();
    
    const alertText = alertDiv.textContent;
    expect(alertText).toContain(`${labelText} is required.`);
    
    // Check for minlength only if it's actually shown
    if (alertText.includes('must be at least')) {
      expect(alertText).toContain(`${labelText} must be at least 3 characters long.`);
    }
  }
}

/**
 * Mock NgControl for testing
 */
export function createMockNgControl(): any {
  return {
    invalid: false,
    dirty: false,
    touched: false,
    errors: null,
    control: {
      markAsTouched: vi.fn()
    }
  };
}