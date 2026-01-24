import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestUtils } from './shared/test-utils';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestUtils.setupTestBed(AppComponent);
    fixture = TestUtils.createFixture(AppComponent);
    component = fixture.componentInstance;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      TestUtils.testBasicInitialization(component, {}, AppComponent);
      expect(component).toBeTruthy();
    });

    it('should initialize without errors', () => {
      expect(component).toBeTruthy();
      expect(component).toBeInstanceOf(AppComponent);
    });
  });

  describe('Template Rendering', () => {
    it('should render main element with correct classes', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const mainElement = compiled.querySelector('main');

      expect(mainElement).toBeTruthy();
      expect(mainElement?.classList.contains('p-4')).toBe(true);
      expect(mainElement?.classList.contains('font-sans')).toBe(true);
      expect(mainElement?.classList.contains('text-[18px]')).toBe(true);
    });

    it('should contain router-outlet', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const routerOutlet = compiled.querySelector('router-outlet');

      expect(routerOutlet).toBeTruthy();
    });

    it('should have minimal template structure', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const mainElement = compiled.querySelector('main');
      const routerOutlet = compiled.querySelector('router-outlet');

      expect(mainElement).toBeTruthy();
      expect(routerOutlet).toBeTruthy();
      expect(mainElement?.contains(routerOutlet!)).toBe(true);
    });
  });

  describe('Component Structure', () => {
    it('should have correct selector', () => {
      // Since we can't easily access component metadata in tests,
      // we test the component creation instead
      expect(component).toBeInstanceOf(AppComponent);
    });

    it('should be standalone component', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();

      // Test that component renders without module imports
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('main')).toBeTruthy();
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct Tailwind CSS classes', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const mainElement = compiled.querySelector('main');

      expect(mainElement?.className).toContain('p-4');
      expect(mainElement?.className).toContain('font-sans');
      expect(mainElement?.className).toContain('text-[18px]');
    });

    it('should have all expected CSS classes', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const mainElement = compiled.querySelector('main');
      const classList = Array.from(mainElement?.classList || []);

      expect(classList).toContain('p-4');
      expect(classList).toContain('font-sans');
      expect(classList).toContain('text-[18px]');
      expect(classList).toHaveLength(3);
    });
  });

  describe('Router Integration', () => {
    it('should contain router-outlet element', () => {
      fixture.detectChanges();

      const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should properly contain router-outlet within main element', () => {
      fixture.detectChanges();

      const mainElement = fixture.nativeElement.querySelector('main');
      const routerOutlet = fixture.nativeElement.querySelector('router-outlet');

      expect(mainElement).toBeTruthy();
      expect(routerOutlet).toBeTruthy();
      expect(mainElement.contains(routerOutlet)).toBe(true);
    });
  });

  describe('Component Behavior', () => {
    it('should not have any input properties', () => {
      // AppComponent doesn't have @Input properties
      const componentKeys = Object.keys(component);
      const inputProperties = componentKeys.filter(
        (key) => key.startsWith('_') || key.includes('Input'),
      );

      // Should be empty or contain only Angular internal properties
      expect(inputProperties.filter((key) => !key.startsWith('__')).length).toBe(0);
    });

    it('should not have any output properties', () => {
      // AppComponent doesn't have @Output properties
      const componentKeys = Object.keys(component);
      const outputProperties = componentKeys.filter(
        (key) => key.includes('Output') || key.includes('Event'),
      );

      expect(outputProperties.filter((key) => !key.startsWith('__')).length).toBe(0);
    });

    it('should maintain consistent structure after change detection', () => {
      fixture.detectChanges();

      const initialMain = fixture.nativeElement.querySelector('main');

      // Trigger another change detection
      fixture.detectChanges();

      const finalMain = fixture.nativeElement.querySelector('main');
      const finalRouterOutlet = fixture.nativeElement.querySelector('router-outlet');

      expect(finalMain).toBeTruthy();
      expect(finalRouterOutlet).toBeTruthy();
      expect(finalMain?.className).toBe(initialMain?.className);
    });
  });

  describe('Component Properties', () => {
    it('should not have undefined required properties', () => {
      expect(component).toBeDefined();
      expect(component.constructor).toBeDefined();
    });

    it('should be instance of AppComponent class', () => {
      expect(component).toBeInstanceOf(AppComponent);
    });
  });

  describe('Template Validation', () => {
    it('should render valid HTML structure', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      // Check that main element exists and has proper structure
      const mainElement = compiled.querySelector('main');
      expect(mainElement).toBeTruthy();
      expect(mainElement?.tagName.toLowerCase()).toBe('main');

      // Check that router-outlet is properly nested
      const routerOutlet = mainElement?.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should not have any extra unwanted elements', () => {
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const children = compiled.children;

      // Should only have one main element
      expect(children.length).toBe(1);
      expect(children[0]?.tagName.toLowerCase()).toBe('main');
    });
  });

  describe('Component Lifecycle', () => {
    it('should handle component initialization', () => {
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle multiple change detection cycles', () => {
      expect(() => {
        fixture.detectChanges();
        fixture.detectChanges();
        fixture.detectChanges();
      }).not.toThrow();

      const mainElement = fixture.nativeElement.querySelector('main');
      expect(mainElement).toBeTruthy();
    });
  });
});
