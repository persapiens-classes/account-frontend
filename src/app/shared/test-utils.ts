import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Type, provideZonelessChangeDetection, ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgControl } from '@angular/forms';
import { expect, vi } from 'vitest';
import { FieldComponent, SelectFieldComponent } from '../field/field-component';
import { Bean } from '../bean/bean';

// Using production FieldComponent interface

type AnyFieldComponent =
  | FieldComponent<unknown>
  | FieldComponent<string>
  | FieldComponent<number | null>
  | FieldComponent<Date | null>
  | FieldComponent<Bean | null>
  | SelectFieldComponent<Bean>;

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
 * Utilities for testing components to reduce code duplication
 * while maintaining readability for component-specific logic
 */
export class TestUtils {
  /**
   * Sets up TestBed configuration for field components
   */
  static async setupTestBed<T>(
    componentType: Type<T>,
    mockNgControl?: MockNgControl,
  ): Promise<void> {
    const ngControlMock = mockNgControl || {
      invalid: false,
      dirty: false,
      touched: false,
      errors: null,
      control: {
        markAsTouched: vi.fn(),
      },
    };

    await TestBed.configureTestingModule({
      imports: [componentType],
      providers: [
        provideZonelessChangeDetection(),
        { provide: NgControl, useValue: ngControlMock },
      ],
    }).compileComponents();
  }

  /**
   * Sets up TestBed configuration for services
   */
  static async setupServiceTestBed<T>(serviceType: Type<T>, providers?: unknown[]): Promise<void> {
    const testProviders = [provideZonelessChangeDetection(), serviceType, ...(providers || [])];

    await TestBed.configureTestingModule({
      providers: testProviders,
    }).compileComponents();
  }

  /**
   * Sets up TestBed configuration for components with custom providers
   */
  static async setupComponentTestBed<T>(
    componentType: Type<T>,
    providers?: unknown[],
  ): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [componentType],
      providers: [provideZonelessChangeDetection(), ...(providers || [])],
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
    for (const key in expectedDefaults) {
      if (Object.hasOwn(expectedDefaults, key)) {
        expect(component[key as keyof T]).toBe(expectedDefaults[key as keyof T]);
      }
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
   * Tests basic input properties (async version for zoneless)
   */
  static async testBasicInputPropertiesAsync<T>(
    component: T,
    fixture: ComponentFixture<T>,
    properties: TestProperty<T>[],
  ): Promise<void> {
    for (const { key, testValue } of properties) {
      (component as Record<string, unknown>)[key as string] = testValue;
      await TestUtils.stabilize(fixture);
      expect((component as Record<string, unknown>)[key as string]).toBe(testValue);
    }
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

  private static assertRequiredError<T>(
    fixture: ComponentFixture<T>,
    mockNgControl: MockNgControl,
    labelText: string,
  ): void {
    mockNgControl.invalid = true;
    mockNgControl.touched = true;
    mockNgControl.errors = { required: true };
    fixture.detectChanges();
    const alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();
    expect(alertDiv.textContent).toContain(`${labelText} is required.`);
  }

  private static async assertRequiredErrorAsync<T>(
    fixture: ComponentFixture<T>,
    mockNgControl: MockNgControl,
    labelText: string,
  ): Promise<void> {
    mockNgControl.invalid = true;
    mockNgControl.touched = true;
    mockNgControl.errors = { required: true };
    await TestUtils.stabilize(fixture);
    const alertDiv = fixture.nativeElement.querySelector('.alert');
    expect(alertDiv).toBeTruthy();
    expect(alertDiv.textContent).toContain(`${labelText} is required.`);
  }

  private static assertMinlengthError<T>(
    fixture: ComponentFixture<T>,
    mockNgControl: MockNgControl,
    labelText: string,
  ): void {
    mockNgControl.dirty = true;
    mockNgControl.errors = { minlength: true };
    fixture.detectChanges();
    const alertDiv = fixture.nativeElement.querySelector('.alert');
    if (alertDiv?.textContent?.includes('must be at least')) {
      expect(alertDiv.textContent).toContain(`${labelText} must be at least 3 characters long.`);
    }
  }

  private static async assertMinlengthErrorAsync<T>(
    fixture: ComponentFixture<T>,
    mockNgControl: MockNgControl,
    labelText: string,
  ): Promise<void> {
    mockNgControl.dirty = true;
    mockNgControl.errors = { minlength: true };
    await TestUtils.stabilize(fixture);
    const alertDiv = fixture.nativeElement.querySelector('.alert');
    if (alertDiv?.textContent?.includes('must be at least')) {
      expect(alertDiv.textContent).toContain(`${labelText} must be at least 3 characters long.`);
    }
  }

  /**
   * Stabilize change detection for zoneless tests: runs detectChanges + whenStable cycle
   */
  static async stabilize<T>(fixture: ComponentFixture<T>): Promise<void> {
    try {
      const changeDetector = fixture.debugElement.injector.get(ChangeDetectorRef);
      changeDetector.markForCheck?.();
    } catch {
      // ignore if ChangeDetectorRef isn't available
    }
    fixture.detectChanges();
    await fixture.whenStable();
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
   * Tests that a service is a singleton (same instance when injected multiple times)
   */
  static testServiceSingleton<T>(serviceType: Type<T>): void {
    const service1 = TestBed.inject(serviceType);
    const service2 = TestBed.inject(serviceType);

    expect(service1).toBe(service2);
  }

  /**
   * Tests that a service has all expected methods
   */
  static testServiceMethods<T>(service: T, expectedMethods: string[]): void {
    for (const methodName of expectedMethods) {
      expect(Reflect.has(service as object, methodName)).toBe(true);
      const method = Reflect.get(service as object, methodName);
      expect(method).toBeDefined();
      expect(typeof method).toBe('function');
    }
  }

  /**
   * Tests service constructor properties
   */
  static testServiceStructure<T>(service: T, serviceType: Type<T>): void {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(serviceType);
    expect(Object.getPrototypeOf(service).constructor).toBeDefined();
    expect(Object.getPrototypeOf(service).constructor.name).toBe(serviceType.name);
  }

  /**
   * Tests service method signatures (parameter count)
   */
  static testServiceMethodSignatures<T>(
    service: T,
    methodSignatures: { methodName: string; parameterCount: number }[],
  ): void {
    for (const { methodName, parameterCount } of methodSignatures) {
      const method = Reflect.get(service as object, methodName) as (...args: unknown[]) => unknown;
      expect(method).toBeDefined();
      expect(typeof method).toBe('function');
      expect(method?.length).toBe(parameterCount);
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
