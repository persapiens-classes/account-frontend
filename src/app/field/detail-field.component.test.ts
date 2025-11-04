import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';
import { DetailFieldComponent } from './detail-field.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestUtils } from '../shared/test-utils';

describe('DetailFieldComponent', () => {
  let component: DetailFieldComponent;
  let fixture: ComponentFixture<DetailFieldComponent>;

  beforeEach(async () => {
    await TestUtils.setupTestBed(DetailFieldComponent);
    fixture = TestUtils.createFixture(DetailFieldComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      TestUtils.testBasicInitialization(component, { strong: '', value: '' }, DetailFieldComponent);
    });
  });

  describe('Template Rendering', () => {
    it('should render the template with default values', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const containerDiv = compiled.querySelector('div.flex.items-center.mb-2\\.5');

      expect(containerDiv).toBeTruthy();
    });

    it('should display strong and value in template', () => {
      // Arrange
      component.strong = 'Name';
      component.value = 'John Doe';

      // Act
      fixture.detectChanges();

      // Assert
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('Name');
      expect(spanElement?.textContent?.trim()).toBe('John Doe');
    });

    it('should display empty strings when values are empty', () => {
      // Arrange - values are already empty by default

      // Act
      fixture.detectChanges();

      // Assert
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('');
      expect(spanElement?.textContent?.trim()).toBe('');
    });
  });

  describe('Input Properties', () => {
    it('should accept input properties', async () => {
      await TestUtils.testBasicInputPropertiesAsync(component, fixture, [
        { key: 'strong', testValue: 'Test Label' },
        { key: 'value', testValue: 'Test Value' },
      ]);

      // Additional assertions for DOM rendering
      const strongElement = fixture.nativeElement.querySelector('strong');
      const spanElement = fixture.nativeElement.querySelector('span');
      expect(strongElement.textContent.trim()).toBe('Test Label');
      expect(spanElement.textContent.trim()).toBe('Test Value');
    });

    it('should accept strong input property individually', () => {
      // Arrange
      const testValue = 'Test Label';

      // Act
      component.strong = testValue;
      fixture.detectChanges();

      // Assert
      expect(component.strong).toBe(testValue);

      const strongElement = fixture.nativeElement.querySelector('strong');
      expect(strongElement.textContent.trim()).toBe(testValue);
    });

    it('should accept value input property individually', () => {
      // Arrange
      const testValue = 'Test Value';

      // Act
      component.value = testValue;
      fixture.detectChanges();

      // Assert
      expect(component.value).toBe(testValue);

      const spanElement = fixture.nativeElement.querySelector('span');
      expect(spanElement.textContent.trim()).toBe(testValue);
    });

    it('should handle numeric values', () => {
      // Arrange
      component.strong = 'Age';
      component.value = '25';

      // Act
      fixture.detectChanges();

      // Assert
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('Age');
      expect(spanElement?.textContent?.trim()).toBe('25');
    });

    it('should handle special characters and spaces', () => {
      // Arrange
      component.strong = 'Full Name & Title';
      component.value = 'John Doe - Senior Developer';

      // Act
      fixture.detectChanges();

      // Assert
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('Full Name & Title');
      expect(spanElement?.textContent?.trim()).toBe('John Doe - Senior Developer');
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct CSS classes applied', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const containerDiv = compiled.querySelector('div');
      const strongElement = compiled.querySelector('strong');

      // Check container classes
      expect(containerDiv?.classList.contains('flex')).toBe(true);
      expect(containerDiv?.classList.contains('items-center')).toBe(true);
      expect(containerDiv?.classList.contains('mb-2.5')).toBe(true);

      // Check strong element classes
      expect(strongElement?.classList.contains('inline-block')).toBe(true);
      expect(strongElement?.classList.contains('w-[130px]')).toBe(true);
      expect(strongElement?.classList.contains('font-bold')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values gracefully', () => {
      // Arrange
      component.strong = null as unknown as string;
      component.value = null as unknown as string;

      // Act
      fixture.detectChanges();

      // Assert - Angular should handle null by displaying empty
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('');
      expect(spanElement?.textContent?.trim()).toBe('');
    });

    it('should handle undefined values gracefully', () => {
      // Arrange
      component.strong = undefined as unknown as string;
      component.value = undefined as unknown as string;

      // Act
      fixture.detectChanges();

      // Assert - Angular should handle undefined by displaying empty
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('');
      expect(spanElement?.textContent?.trim()).toBe('');
    });

    it('should handle very long text', () => {
      // Arrange
      const longText =
        'This is a very long text that might cause display issues if not handled properly by the component styling and layout';
      component.strong = 'Long Label';
      component.value = longText;

      // Act
      fixture.detectChanges();

      // Assert
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('Long Label');
      expect(spanElement?.textContent?.trim()).toBe(longText);
    });
  });

  describe('Component Integration', () => {
    it('should work with DebugElement queries', () => {
      // Arrange
      component.strong = 'Debug Test';
      component.value = 'Debug Value';
      fixture.detectChanges();

      // Act - Using direct DOM query approach since TestUtils.testEventHandling is for events
      const strongDebugElement: DebugElement = fixture.debugElement.query(By.css('strong'));
      const spanDebugElement: DebugElement = fixture.debugElement.query(By.css('span'));

      // Assert
      expect(strongDebugElement).toBeTruthy();
      expect(spanDebugElement).toBeTruthy();
      expect(strongDebugElement.nativeElement.textContent.trim()).toBe('Debug Test');
      expect(spanDebugElement.nativeElement.textContent.trim()).toBe('Debug Value');
    });

    it('should support change detection', async () => {
      // Arrange
      component.strong = 'Initial';
      component.value = 'Initial Value';
      await TestUtils.stabilize(fixture);

      // Act - Change values
      component.strong = 'Updated';
      component.value = 'Updated Value';
      await TestUtils.stabilize(fixture);

      // Assert
      const compiled = fixture.nativeElement as HTMLElement;
      const strongElement = compiled.querySelector('strong');
      const spanElement = compiled.querySelector('span');

      expect(strongElement?.textContent?.trim()).toBe('Updated');
      expect(spanElement?.textContent?.trim()).toBe('Updated Value');
    });
  });
});
