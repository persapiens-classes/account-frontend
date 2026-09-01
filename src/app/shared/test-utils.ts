import { TestBed } from '@angular/core/testing';
import { Type, provideZonelessChangeDetection } from '@angular/core';

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
}
