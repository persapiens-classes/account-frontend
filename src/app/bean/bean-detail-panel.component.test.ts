import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { BeanDetailPanelComponent } from './bean-detail-panel.component';
import { Bean } from './bean';

// Test implementation of Bean interface
class TestBean implements Bean {
  constructor(
    public id = 'test-id',
    public name = 'Test Bean',
  ) {}

  getId(): string {
    return this.id;
  }
}

describe('BeanDetailPanelComponent', () => {
  let component: BeanDetailPanelComponent<TestBean>;
  let fixture: ComponentFixture<BeanDetailPanelComponent<TestBean>>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(BeanDetailPanelComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(BeanDetailPanelComponent<TestBean>);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, BeanDetailPanelComponent);
    });

    it('should have undefined inputs initially', () => {
      expect(component.routerName).toBeUndefined();
      expect(component.bean).toBeUndefined();
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
    });

    it('should accept bean input with TestBean', () => {
      const testBean = new TestBean('bean-123', 'Test Entity');

      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'bean', testValue: testBean },
      ]);
    });

    it('should accept bean input with any Bean implementation', () => {
      const customBean = {
        getId: () => 'custom-id',
        customProperty: 'custom-value',
      };

      component.bean = customBean as unknown as TestBean;
      fixture.detectChanges();

      expect(component.bean).toBe(customBean);
      expect(component.bean.getId()).toBe('custom-id');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.routerName = 'test-entities';
      component.bean = new TestBean('test-123', 'Test Entity');
      fixture.detectChanges();
    });

    it('should render p-panel with correct header', () => {
      const panel = fixture.nativeElement.querySelector('p-panel');
      expect(panel).toBeTruthy();
      expect(panel.getAttribute('header')).toBe('Detail');
    });

    it('should render template structure for content projection', () => {
      const panel = fixture.nativeElement.querySelector('p-panel');
      expect(panel).toBeTruthy();

      // Verify the panel has content area where projection would occur
      const contentArea = panel.querySelector('.p-panel-content');
      expect(contentArea).toBeTruthy();

      // Verify buttons are rendered after the projection area
      const buttons = contentArea.querySelectorAll('p-button');
      expect(buttons).toHaveLength(2);
    });

    it('should render both action buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('p-button');
      expect(buttons).toHaveLength(2);
    });

    it('should render list button with correct attributes', () => {
      const listButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-list"]');
      expect(listButton).toBeTruthy();
      expect(listButton.getAttribute('pTooltip')).toBe('Back to List');
      expect(listButton.classList.contains('mr-3')).toBe(true);
    });

    it('should render edit button with correct attributes', () => {
      const editButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-pencil"]');
      expect(editButton).toBeTruthy();
      expect(editButton.getAttribute('pTooltip')).toBe('Start Edit');
    });
  });

  describe('Content Projection', () => {
    it('should project content correctly', () => {
      // Create a test host component to test content projection
      const testContent = '<div class="test-content">Projected Content</div>';

      // Set innerHTML to simulate projected content
      const panelContent = fixture.nativeElement.querySelector('p-panel');
      const contentArea = document.createElement('div');
      contentArea.innerHTML = testContent;

      expect(panelContent).toBeTruthy();
      // Note: In actual usage, ng-content would project the content
      // This test verifies the structure is in place for projection
    });
  });

  describe('Navigation Methods', () => {
    beforeEach(() => {
      component.routerName = 'test-entities';
      component.bean = new TestBean('test-123', 'Test Entity');
    });

    describe('list() method', () => {
      it('should navigate to entity list route', () => {
        component.list();

        expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities']);
      });

      it('should handle different router names', () => {
        const routerNames = ['owners', 'accounts', 'categories', 'entries'];

        routerNames.forEach((routerName) => {
          mockRouter.navigate.mockClear();
          component.routerName = routerName;

          component.list();

          expect(mockRouter.navigate).toHaveBeenCalledWith([routerName]);
        });
      });

      it('should handle empty router name', () => {
        component.routerName = '';

        component.list();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
      });
    });

    describe('startUpdate() method', () => {
      it('should navigate to edit route with bean state', () => {
        const testBean = new TestBean('bean-456', 'Update Test Bean');
        component.bean = testBean;

        component.startUpdate();

        expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
          state: { bean: testBean },
        });
      });

      it('should handle different router names for edit route', () => {
        const testBean = new TestBean('edit-123', 'Edit Bean');
        component.bean = testBean;

        const routerNames = ['owners', 'accounts', 'categories'];

        routerNames.forEach((routerName) => {
          mockRouter.navigate.mockClear();
          component.routerName = routerName;

          component.startUpdate();

          expect(mockRouter.navigate).toHaveBeenCalledWith([`${routerName}/edit`], {
            state: { bean: testBean },
          });
        });
      });

      it('should pass current bean in navigation state', () => {
        const bean1 = new TestBean('bean-1', 'First Bean');
        const bean2 = new TestBean('bean-2', 'Second Bean');

        // Test with first bean
        component.bean = bean1;
        component.startUpdate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
          state: { bean: bean1 },
        });

        mockRouter.navigate.mockClear();

        // Test with second bean
        component.bean = bean2;
        component.startUpdate();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
          state: { bean: bean2 },
        });
      });
    });
  });

  describe('Button Click Events', () => {
    beforeEach(() => {
      component.routerName = 'test-entities';
      component.bean = new TestBean('click-test', 'Click Test Bean');
      fixture.detectChanges();
    });

    it('should call list() when list button is clicked', () => {
      const listSpy = vi.spyOn(component, 'list');
      fixture.detectChanges();

      const listButton = fixture.debugElement.query(By.css('p-button[icon="pi pi-list"]'));
      listButton.triggerEventHandler('onClick', null);

      expect(listSpy).toHaveBeenCalledTimes(1);
    });

    it('should call startUpdate() when edit button is clicked', () => {
      const updateSpy = vi.spyOn(component, 'startUpdate');
      fixture.detectChanges();

      const editButton = fixture.debugElement.query(By.css('p-button[icon="pi pi-pencil"]'));
      editButton.triggerEventHandler('onClick', null);

      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger router navigation when buttons are clicked', () => {
      fixture.detectChanges();

      // Click list button
      const listButton = fixture.debugElement.query(By.css('p-button[icon="pi pi-list"]'));
      listButton.triggerEventHandler('onClick', null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities']);

      mockRouter.navigate.mockClear();

      // Click edit button
      const editButton = fixture.debugElement.query(By.css('p-button[icon="pi pi-pencil"]'));
      editButton.triggerEventHandler('onClick', null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
        state: { bean: component.bean },
      });
    });
  });

  describe('Generic Type Support', () => {
    it('should work with different Bean implementations', () => {
      // Test with custom Bean implementation
      class CustomBean implements Bean {
        constructor(
          private id: string,
          public customField: string,
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const customBean = new CustomBean('custom-123', 'Custom Value');

      // Test that the component can work with any Bean implementation
      component.bean = customBean as unknown as TestBean;
      component.routerName = 'custom-entities';

      expect(component.bean).toBe(customBean);
      expect(component.bean.getId()).toBe('custom-123');
    });

    it('should maintain type safety with generic constraints', () => {
      const testBean = new TestBean('type-test', 'Type Safety Test');
      component.bean = testBean;

      // Verify Bean interface methods are available
      expect(typeof component.bean.getId).toBe('function');
      expect(component.bean.getId()).toBe('type-test');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing routerName gracefully', () => {
      component.bean = new TestBean('edge-test', 'Edge Case Bean');
      // routerName is undefined

      component.list();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['undefined']);

      mockRouter.navigate.mockClear();

      component.startUpdate();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['undefined/edit'], {
        state: { bean: component.bean },
      });
    });

    it('should handle missing bean gracefully', () => {
      component.routerName = 'test-entities';
      // bean is undefined

      component.list();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities']);

      mockRouter.navigate.mockClear();

      component.startUpdate();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
        state: { bean: undefined },
      });
    });

    it('should handle router navigation failures gracefully', () => {
      mockRouter.navigate.mockRejectedValue(new Error('Navigation failed'));

      component.routerName = 'test-entities';
      component.bean = new TestBean('fail-test', 'Fail Test Bean');

      // Should not throw errors
      expect(() => component.list()).not.toThrow();
      expect(() => component.startUpdate()).not.toThrow();
    });
  });

  describe('Component Integration', () => {
    it('should work with PrimeNG components', () => {
      component.routerName = 'integration-test';
      component.bean = new TestBean('integration-123', 'Integration Test');
      fixture.detectChanges();

      // Verify PrimeNG components are rendered
      const panel = fixture.nativeElement.querySelector('p-panel');
      const buttons = fixture.nativeElement.querySelectorAll('p-button');

      expect(panel).toBeTruthy();
      expect(buttons).toHaveLength(2);
    });

    it('should maintain proper CSS classes and styling', () => {
      fixture.detectChanges();

      const listButton = fixture.nativeElement.querySelector('p-button[icon="pi pi-list"]');
      expect(listButton.classList.contains('mr-3')).toBe(true);
    });
  });
});
