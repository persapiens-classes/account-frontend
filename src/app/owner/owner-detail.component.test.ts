import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { OwnerDetailComponent } from './owner-detail.component';
import { Owner, createOwner } from './owner';
import { toBeanFromHistory } from '../bean/bean';

// Mock the toBeanFromHistory function
vi.mock('../bean/bean', () => ({
  toBeanFromHistory: vi.fn(),
}));

describe('OwnerDetailComponent', () => {
  let component: OwnerDetailComponent;
  let fixture: ComponentFixture<OwnerDetailComponent>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockToBeanFromHistory: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    // Setup mock for toBeanFromHistory
    mockToBeanFromHistory = vi.mocked(toBeanFromHistory);
    mockToBeanFromHistory.mockReturnValue(new Owner('Test Owner'));

    await TestUtils.setupComponentTestBed(OwnerDetailComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(OwnerDetailComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, OwnerDetailComponent);
    });

    it('should initialize bean using toBeanFromHistory', () => {
      expect(mockToBeanFromHistory).toHaveBeenCalledWith(createOwner);
      // Note: Called multiple times due to component creation in different tests
      expect(mockToBeanFromHistory.mock.calls.length).toBeGreaterThan(0);
    });

    it('should have Owner bean with expected structure', () => {
      expect(component.bean).toBeDefined();
      expect(component.bean).toBeInstanceOf(Owner);
      expect(typeof component.bean.getId).toBe('function');
      expect(typeof component.bean.name).toBe('string');
    });

    it('should set bean property correctly', () => {
      const testOwner = new Owner('Integration Test Owner');

      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'bean', testValue: testOwner },
      ]);

      expect(component.bean.name).toBe('Integration Test Owner');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.bean = new Owner('Template Test Owner');
      fixture.detectChanges();
    });

    it('should render BeanDetailPanelComponent with correct props', () => {
      // Use helper function pattern for DOM element testing
      const testBeanDetailPanelProps = () => {
        const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));
        expect(beanDetailPanel).toBeTruthy();
        expect(beanDetailPanel.componentInstance.routerName).toBe('owners');
        expect(beanDetailPanel.componentInstance.bean).toBe(component.bean);
      };

      testBeanDetailPanelProps();
    });

    it('should render DetailFieldComponent with owner name', () => {
      const detailField = fixture.debugElement.query(By.css('app-detail-field'));

      expect(detailField).toBeTruthy();
      expect(detailField.componentInstance.strong).toBe('Name');
      expect(detailField.componentInstance.value).toBe('Template Test Owner');
    });

    it('should project DetailFieldComponent inside BeanDetailPanelComponent', () => {
      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));
      const detailFieldInPanel = beanDetailPanel.query(By.css('app-detail-field'));

      expect(detailFieldInPanel).toBeTruthy();
      expect(detailFieldInPanel.componentInstance.strong).toBe('Name');
      expect(detailFieldInPanel.componentInstance.value).toBe(component.bean.name);
    });

    it('should update DetailField when bean name changes', () => {
      // Change bean name
      component.bean = new Owner('Updated Owner Name');
      fixture.detectChanges();

      const detailField = fixture.debugElement.query(By.css('app-detail-field'));
      expect(detailField.componentInstance.value).toBe('Updated Owner Name');
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      component.bean = new Owner('Integration Owner');
      fixture.detectChanges();
    });

    it('should have correct component hierarchy', () => {
      // Test using helper function pattern
      const testComponentHierarchy = () => {
        const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));
        expect(beanDetailPanel).toBeTruthy();

        const detailField = beanDetailPanel.query(By.css('app-detail-field'));
        expect(detailField).toBeTruthy();

        const directChildren = fixture.debugElement.children;
        expect(directChildren).toHaveLength(1);
        expect(directChildren[0].nativeElement.tagName.toLowerCase()).toBe('app-bean-detail-panel');
      };

      testComponentHierarchy();
    });

    it('should pass correct routerName to BeanDetailPanelComponent', () => {
      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));

      expect(beanDetailPanel.componentInstance.routerName).toBe('owners');
    });

    it('should pass bean instance to BeanDetailPanelComponent', () => {
      const testOwner = new Owner('Bean Passing Test');
      component.bean = testOwner;
      fixture.detectChanges();

      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));

      expect(beanDetailPanel.componentInstance.bean).toBe(testOwner);
      expect(beanDetailPanel.componentInstance.bean.name).toBe('Bean Passing Test');
    });
  });

  describe('Bean Interface Compliance', () => {
    it('should have bean that implements Bean interface', () => {
      expect(component.bean.getId).toBeDefined();
      expect(typeof component.bean.getId).toBe('function');
    });

    it('should return name as ID from Bean interface', () => {
      component.bean = new Owner('Bean Interface Test');
      expect(component.bean.getId()).toBe('Bean Interface Test');
    });

    it('should work with different owner names', () => {
      const testNames = ['John Doe', 'Jane Smith', '', 'Owner with spaces'];

      // Use TestUtils pattern for property testing
      testNames.forEach((name) => {
        TestUtils.testBasicInputProperties(component, fixture, [
          { key: 'bean', testValue: new Owner(name) },
        ]);
        expect(component.bean.getId()).toBe(name);
      });
    });
  });

  describe('Navigation Integration', () => {
    beforeEach(() => {
      component.bean = new Owner('Navigation Test Owner');
      fixture.detectChanges();
    });

    it('should enable list navigation through BeanDetailPanelComponent', () => {
      TestUtils.testEventHandling(
        fixture,
        'app-bean-detail-panel p-button[icon="pi pi-list"]',
        'onClick',
        null,
        mockRouter.navigate,
      );

      expect(mockRouter.navigate).toHaveBeenCalledWith(['owners']);
    });

    it('should enable edit navigation through BeanDetailPanelComponent', () => {
      const testOwner = new Owner('Edit Navigation Test');
      component.bean = testOwner;
      fixture.detectChanges();

      TestUtils.testEventHandling(
        fixture,
        'app-bean-detail-panel p-button[icon="pi pi-pencil"]',
        'onClick',
        null,
        mockRouter.navigate,
      );

      expect(mockRouter.navigate).toHaveBeenCalledWith(['owners/edit'], {
        state: { bean: testOwner },
      });
    });
  });

  describe('History State Integration', () => {
    it('should call toBeanFromHistory with createOwner function', () => {
      // Component is already created in beforeEach, so toBeanFromHistory was called
      expect(mockToBeanFromHistory).toHaveBeenCalledWith(createOwner);
    });

    it('should handle different history states', () => {
      // Test with different mock returns to simulate different history states
      const mockOwnerFromHistory = new Owner('From History');
      mockToBeanFromHistory.mockReturnValue(mockOwnerFromHistory);

      const newFixture = TestUtils.createFixture(OwnerDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean).toBe(mockOwnerFromHistory);
      expect(newComponent.bean.name).toBe('From History');
    });

    it('should create Owner with empty name when no history state', () => {
      // Mock toBeanFromHistory to return default created owner
      mockToBeanFromHistory.mockReturnValue(createOwner());

      const newFixture = TestUtils.createFixture(OwnerDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean.name).toBe('');
      expect(newComponent.bean.getId()).toBe('');
    });
  });

  describe('Content Projection', () => {
    beforeEach(() => {
      component.bean = new Owner('Content Projection Test');
      fixture.detectChanges();
    });

    it('should project DetailField content into BeanDetailPanelComponent', () => {
      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));

      // Check that the detail field is projected inside the panel
      const projectedDetailField = beanDetailPanel.query(By.css('app-detail-field'));

      expect(projectedDetailField).toBeTruthy();
      // The projected element exists within the panel's content area
      expect(projectedDetailField).toBeDefined();
      expect(projectedDetailField.componentInstance.strong).toBe('Name');
    });

    it('should maintain proper binding between component and projected content', () => {
      const testOwner = new Owner('Binding Test Owner');
      component.bean = testOwner;
      fixture.detectChanges();

      const detailField = fixture.debugElement.query(By.css('app-detail-field'));

      // Verify the binding is maintained
      expect(detailField.componentInstance.value).toBe(testOwner.name);
      expect(detailField.componentInstance.strong).toBe('Name');
    });
  });

  describe('Edge Cases', () => {
    it('should handle Owner with null/undefined name gracefully', () => {
      // Create owner with null name (testing edge case)
      const ownerWithNullName = new Owner(null as unknown as string);
      mockToBeanFromHistory.mockReturnValue(ownerWithNullName);

      const newFixture = TestUtils.createFixture(OwnerDetailComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.bean).toBe(ownerWithNullName);
      expect(() => newFixture.detectChanges()).not.toThrow();
    });

    it('should handle very long owner names', () => {
      const longName = 'A'.repeat(1000);
      component.bean = new Owner(longName);
      fixture.detectChanges();

      const detailField = fixture.debugElement.query(By.css('app-detail-field'));
      expect(detailField.componentInstance.value).toBe(longName);
    });

    it('should handle special characters in owner names', () => {
      const specialName = 'Owner with @#$%^&*()_+ special chars';
      component.bean = new Owner(specialName);
      fixture.detectChanges();

      const detailField = fixture.debugElement.query(By.css('app-detail-field'));
      expect(detailField.componentInstance.value).toBe(specialName);
      expect(component.bean.getId()).toBe(specialName);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize bean in constructor', () => {
      // Use helper pattern for initialization testing
      const testInitialization = () => {
        expect(component.bean).toBeDefined();
        expect(mockToBeanFromHistory).toHaveBeenCalled();
      };

      testInitialization();
    });

    it('should not reinitialize bean after construction', () => {
      const initialCallCount = mockToBeanFromHistory.mock.calls.length;

      // Test multiple change detection cycles
      const testChangeDetectionStability = () => {
        fixture.detectChanges();
        fixture.detectChanges();
        fixture.detectChanges();
        expect(mockToBeanFromHistory).toHaveBeenCalledTimes(initialCallCount);
      };

      testChangeDetectionStability();
    });

    it('should maintain bean reference throughout component lifecycle', () => {
      const initialBean = component.bean;

      // Test reference stability using helper pattern
      const testReferenceStability = () => {
        fixture.detectChanges();
        expect(component.bean).toBe(initialBean);
        fixture.detectChanges();
        expect(component.bean).toBe(initialBean);
      };

      testReferenceStability();
    });
  });
});
