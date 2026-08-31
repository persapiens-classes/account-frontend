import { TestBed } from '@angular/core/testing';
import { Type, provideZonelessChangeDetection } from '@angular/core';
import { expect } from 'vitest';
import { HttpClient } from '@angular/common/http';

type HttpClientMethodName =
  'post' | 'get' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'request';

export type HttpClientTestMock = Record<HttpClientMethodName, ReturnType<typeof vi.fn>>;

export function createHttpClientTestMock(overrides: Partial<HttpClientTestMock> = {}): HttpClient {
  const mock: HttpClientTestMock = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    head: vi.fn(),
    options: vi.fn(),
    request: vi.fn(),
    ...overrides,
  };

  return mock as unknown as HttpClient;
}

/**
 * Utilities for testing components to reduce code duplication
 * while maintaining readability for component-specific logic
 */
export class TestUtils {
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
