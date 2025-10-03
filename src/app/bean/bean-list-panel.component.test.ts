import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { BeanListPanelComponent } from './bean-list-panel.component';

describe('BeanListPanelComponent', () => {
  let component: BeanListPanelComponent;
  let fixture: ComponentFixture<BeanListPanelComponent>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(BeanListPanelComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(BeanListPanelComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, BeanListPanelComponent);
      expect(component).toBeTruthy();
    });

    it('should have undefined routerName initially', () => {
      expect(component.routerName).toBeUndefined();
    });

    it('should inject Router service', () => {
      expect(component['router']).toBeDefined();
      expect(component['router']).toBe(mockRouter);
    });
  });

  describe('Input Properties', () => {
    it('should accept routerName input', () => {
      const testRouterName = 'test-entities';

      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'routerName', testValue: testRouterName },
      ]);

      expect(component.routerName).toBe(testRouterName);
    });

    it('should handle different router names', () => {
      const routerNames = ['owners', 'accounts', 'categories', 'entries'];

      routerNames.forEach((routerName) => {
        TestUtils.testBasicInputProperties(component, fixture, [
          { key: 'routerName', testValue: routerName },
        ]);
        expect(component.routerName).toBe(routerName);
      });
    });

    it('should handle empty router name', () => {
      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'routerName', testValue: '' },
      ]);
      expect(component.routerName).toBe('');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.routerName = 'test-entities';
      fixture.detectChanges();
    });

    it('should render p-panel with correct header', () => {
      const panel = fixture.nativeElement.querySelector('p-panel');
      expect(panel).toBeTruthy();
      expect(panel.getAttribute('header')).toBe('List');
    });

    it('should render header template with add button', () => {
      const panel = fixture.nativeElement.querySelector('p-panel');
      expect(panel).toBeTruthy();

      // Check that the header template contains the add button
      const addButton = panel.querySelector('p-button[icon="pi pi-plus"]');
      expect(addButton).toBeTruthy();
    });

    it('should render add button with correct attributes', () => {
      const addButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-plus"]');
      expect(addButton).toBeTruthy();
      expect(addButton.getAttribute('pTooltip')).toBe('Start new owner');
      expect(addButton.getAttribute('autofocus')).toBe('true');
    });

    it('should render ng-content projection area', () => {
      const panel = fixture.nativeElement.querySelector('p-panel');
      expect(panel).toBeTruthy();

      // Verify the panel has content area where projection would occur
      const contentContainer = panel.querySelector('.p-panel-content-container');
      expect(contentContainer).toBeTruthy();
    });

    it('should have correct header layout classes', () => {
      const headerDiv = fixture.nativeElement.querySelector(
        '.flex.justify-between.items-center.w-full.ml-2\\.5',
      );
      expect(headerDiv).toBeTruthy();
    });
  });

  describe('Content Projection', () => {
    beforeEach(() => {
      component.routerName = 'test-entities';
      fixture.detectChanges();
    });

    it('should support content projection for list items', () => {
      const panel = fixture.nativeElement.querySelector('p-panel');
      expect(panel).toBeTruthy();

      // Verify the structure is in place for content projection
      // The panel exists and can contain projected content
      expect(panel.innerHTML).toBeTruthy();
    });

    it('should maintain header template while supporting content projection', () => {
      // Verify both header template and content projection coexist
      const panel = fixture.nativeElement.querySelector('p-panel');
      const addButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-plus"]');

      expect(addButton).toBeTruthy();
      expect(panel).toBeTruthy();

      // Verify content projection area exists (panel can contain content)
      expect(panel.innerHTML).toBeTruthy();
    });
  });

  describe('Navigation Methods', () => {
    beforeEach(() => {
      component.routerName = 'test-entities';
    });

    describe('startInsert() method', () => {
      it('should navigate to new entity route', () => {
        component.startInsert();

        expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/new']);
      });

      it('should handle different router names', () => {
        const routerNames = ['owners', 'accounts', 'categories', 'entries'];

        routerNames.forEach((routerName) => {
          mockRouter.navigate.mockClear();
          component.routerName = routerName;

          component.startInsert();

          expect(mockRouter.navigate).toHaveBeenCalledWith([`${routerName}/new`]);
        });
      });

      it('should handle empty router name', () => {
        component.routerName = '';

        component.startInsert();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/new']);
      });

      it('should handle undefined router name', () => {
        // Reset routerName to undefined
        (component as { routerName?: string }).routerName = undefined;

        component.startInsert();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['undefined/new']);
      });
    });
  });

  describe('Button Click Events', () => {
    beforeEach(() => {
      component.routerName = 'test-entities';
      fixture.detectChanges();
    });

    it('should call startInsert() when add button is clicked', () => {
      const insertSpy = vi.spyOn(component, 'startInsert');

      const addButton = fixture.debugElement.query(By.css('p-button[icon="pi pi-plus"]'));
      addButton.triggerEventHandler('onClick', null);

      expect(insertSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger router navigation when add button is clicked', () => {
      const addButton = fixture.debugElement.query(By.css('p-button[icon="pi pi-plus"]'));
      addButton.triggerEventHandler('onClick', null);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/new']);
    });

    it('should use TestUtils for event handling', () => {
      TestUtils.testEventHandling(
        fixture,
        'p-button[icon="pi pi-plus"]',
        'onClick',
        null,
        mockRouter.navigate,
      );

      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/new']);
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      component.routerName = 'integration-test';
      fixture.detectChanges();
    });

    it('should work with PrimeNG components', () => {
      // Verify PrimeNG components are rendered
      const panel = fixture.nativeElement.querySelector('p-panel');
      const button = fixture.nativeElement.querySelector('p-button');

      expect(panel).toBeTruthy();
      expect(button).toBeTruthy();
    });

    it('should have correct component hierarchy', () => {
      // Test using helper function pattern
      const testComponentHierarchy = () => {
        const panel = fixture.debugElement.query(By.css('p-panel'));
        expect(panel).toBeTruthy();

        const addButton = panel.query(By.css('p-button[icon="pi pi-plus"]'));
        expect(addButton).toBeTruthy();

        const directChildren = fixture.debugElement.children;
        expect(directChildren).toHaveLength(1);
        expect(directChildren[0].nativeElement.tagName.toLowerCase()).toBe('p-panel');
      };

      testComponentHierarchy();
    });

    it('should maintain proper CSS classes and styling', () => {
      const headerDiv = fixture.nativeElement.querySelector(
        '.flex.justify-between.items-center.w-full.ml-2\\.5',
      );
      expect(headerDiv).toBeTruthy();

      // Verify Tailwind CSS classes are applied
      expect(headerDiv.classList.contains('flex')).toBe(true);
      expect(headerDiv.classList.contains('justify-between')).toBe(true);
      expect(headerDiv.classList.contains('items-center')).toBe(true);
      expect(headerDiv.classList.contains('w-full')).toBe(true);
    });
  });

  describe('Accessibility Features', () => {
    beforeEach(() => {
      component.routerName = 'accessibility-test';
      fixture.detectChanges();
    });

    it('should have autofocus on add button', () => {
      const addButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-plus"]');
      expect(addButton.getAttribute('autofocus')).toBe('true');
    });

    it('should have tooltip for add button', () => {
      const addButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-plus"]');
      expect(addButton.getAttribute('pTooltip')).toBe('Start new owner');
    });

    it('should have proper button semantics', () => {
      const addButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-plus"]');
      expect(addButton).toBeTruthy();
      expect(addButton.getAttribute('icon')).toBe('pi pi-plus');
    });
  });

  describe('Template Structure', () => {
    beforeEach(() => {
      component.routerName = 'template-test';
      fixture.detectChanges();
    });

    it('should use ng-template for header customization', () => {
      // Verify the template structure supports header customization
      const panel = fixture.nativeElement.querySelector('p-panel');
      expect(panel).toBeTruthy();

      // The add button should be in the header template
      const addButton = panel.querySelector('p-button[icon="pi pi-plus"]');
      expect(addButton).toBeTruthy();
    });

    it('should support both header template and content projection', () => {
      const panel = fixture.nativeElement.querySelector('p-panel');

      // Header template elements
      const addButton = panel.querySelector('p-button[icon="pi pi-plus"]');
      expect(addButton).toBeTruthy();

      // Content projection area
      const contentContainer = panel.querySelector('.p-panel-content-container');
      expect(contentContainer).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle router navigation failures gracefully', () => {
      mockRouter.navigate.mockRejectedValue(new Error('Navigation failed'));

      component.routerName = 'test-entities';

      // Should not throw errors
      expect(() => component.startInsert()).not.toThrow();
    });

    it('should handle null router name', () => {
      component.routerName = null as unknown as string;

      component.startInsert();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['null/new']);
    });

    it('should handle special characters in router names', () => {
      const specialRouterName = 'test@#$%entities';
      component.routerName = specialRouterName;

      component.startInsert();

      expect(mockRouter.navigate).toHaveBeenCalledWith([`${specialRouterName}/new`]);
    });
  });

  describe('Component Lifecycle', () => {
    it('should maintain router reference throughout lifecycle', () => {
      const initialRouter = component['router'];

      fixture.detectChanges();
      expect(component['router']).toBe(initialRouter);

      fixture.detectChanges();
      expect(component['router']).toBe(initialRouter);
    });

    it('should not reinitialize router after construction', () => {
      const initialRouter = component['router'];

      // Test lifecycle stability using helper pattern
      const testLifecycleStability = () => {
        fixture.detectChanges();
        expect(component['router']).toBe(initialRouter);
        fixture.detectChanges();
        expect(component['router']).toBe(initialRouter);
      };

      testLifecycleStability();
    });
  });

  describe('RouterName Property Management', () => {
    it('should handle dynamic routerName changes', () => {
      const routerNames = ['initial', 'updated', 'final'];

      routerNames.forEach((routerName) => {
        TestUtils.testBasicInputProperties(component, fixture, [
          { key: 'routerName', testValue: routerName },
        ]);

        component.startInsert();
        expect(mockRouter.navigate).toHaveBeenCalledWith([`${routerName}/new`]);

        mockRouter.navigate.mockClear();
      });
    });

    it('should preserve routerName value across template changes', () => {
      const testRouterName = 'persistent-name';
      component.routerName = testRouterName;

      // Trigger multiple change detection cycles
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      expect(component.routerName).toBe(testRouterName);
    });
  });
});
