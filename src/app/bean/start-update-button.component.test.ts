import { ComponentFixture } from '@angular/core/testing';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { Router } from '@angular/router';
import { StartUpdateButtonComponent } from './start-update-button.component';
import { Bean } from './bean';
import { TestUtils } from '../shared/test-utils';

// Mock implementation of Bean for testing
class TestBean implements Bean {
  constructor(
    public id = '',
    public name = '',
    public value = 0,
  ) {}

  getId(): string {
    return this.id;
  }
}

describe('StartUpdateButtonComponent', () => {
  let component: StartUpdateButtonComponent<TestBean>;
  let fixture: ComponentFixture<StartUpdateButtonComponent<TestBean>>;
  let mockRouter: Router;
  let testBean: TestBean;
  let mockRemovedCallback: () => void;

  beforeEach(async () => {
    // Setup mock router
    mockRouter = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
      url: '/test',
      events: vi.fn(),
    } as unknown as Router;

    // Create test data
    testBean = new TestBean('update-123', 'Update Bean', 200);
    mockRemovedCallback = vi.fn();

    await TestUtils.setupComponentTestBed(StartUpdateButtonComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(StartUpdateButtonComponent) as ComponentFixture<
      StartUpdateButtonComponent<TestBean>
    >;
    component = fixture.componentInstance;

    // Set component inputs
    component.item = testBean;
    component.routerName = 'test-entities';
    component.removed = mockRemovedCallback;

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(
        component,
        {
          item: testBean,
          routerName: 'test-entities',
          removed: mockRemovedCallback,
        },
        StartUpdateButtonComponent,
      );
      expect(component).toBeTruthy();
    });

    it('should render update button with correct properties', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button).toBeTruthy();
      expect(button.getAttribute('icon')).toBe('pi pi-pencil');
      expect(button.getAttribute('pTooltip')).toBe('Edit the account');
      expect(button.classList.contains('mr-4')).toBe(true);
    });
  });

  describe('Input Properties', () => {
    it('should accept item input', () => {
      const newItem = new TestBean('new-update-456', 'New Update Bean', 350);

      TestUtils.testBasicInputProperties(component, fixture, [{ key: 'item', testValue: newItem }]);

      expect(component.item).toBe(newItem);
      expect(component.item.getId()).toBe('new-update-456');
    });

    it('should accept routerName input', () => {
      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'routerName', testValue: 'custom-router' },
      ]);

      expect(component.routerName).toBe('custom-router');
    });

    it('should accept removed callback input', () => {
      const newCallback = vi.fn();

      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'removed', testValue: newCallback },
      ]);

      expect(component.removed).toBe(newCallback);
    });

    it('should handle different router name formats', () => {
      const testCases = ['accounts', 'users', 'products', 'nested/entities', 'api/v1/resources'];

      testCases.forEach((routerName) => {
        component.routerName = routerName;
        fixture.detectChanges();
        expect(component.routerName).toBe(routerName);
      });
    });
  });

  describe('Navigation Functionality', () => {
    it('should navigate to edit route when startUpdate is called', () => {
      component.startUpdate(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
        state: { bean: testBean },
      });
    });

    it('should navigate with correct route structure', () => {
      component.routerName = 'custom-entities';
      component.startUpdate(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['custom-entities/edit'], {
        state: { bean: testBean },
      });
    });

    it('should pass bean in navigation state', () => {
      const customBean = new TestBean('state-789', 'State Bean', 400);
      component.item = customBean;
      component.startUpdate(customBean);

      const navigationCall = vi.mocked(mockRouter.navigate).mock.calls[0];
      expect(navigationCall[1]).toEqual({ state: { bean: customBean } });
    });

    it('should handle different bean types in navigation', () => {
      interface CustomBean extends Bean {
        customProperty: string;
      }

      class CustomBeanImpl implements CustomBean {
        constructor(
          public id = '',
          public customProperty = '',
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const customBean = new CustomBeanImpl('custom-123', 'custom-value');
      const customComponent = new StartUpdateButtonComponent<CustomBeanImpl>();
      customComponent.item = customBean;
      customComponent.routerName = 'custom-beans';
      customComponent.removed = vi.fn();

      // Inject router manually since this is a standalone instance
      (customComponent as unknown as { router: Router }).router = mockRouter;

      customComponent.startUpdate(customBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['custom-beans/edit'], {
        state: { bean: customBean },
      });
    });
  });

  describe('Event Handling', () => {
    it('should handle click events on update button', () => {
      const mockStartUpdate = vi.spyOn(component, 'startUpdate');
      const mockCallback = vi.fn();
      mockStartUpdate.mockImplementation(mockCallback);

      TestUtils.testEventHandling(
        fixture,
        'p-button',
        'onClick',
        new MouseEvent('click'),
        mockCallback,
      );

      expect(mockStartUpdate).toHaveBeenCalled();
    });

    it('should call startUpdate with correct item when button is clicked', () => {
      const mockStartUpdate = vi.spyOn(component, 'startUpdate');
      const button = fixture.nativeElement.querySelector('p-button');

      button.click();

      expect(mockStartUpdate).toHaveBeenCalledWith(testBean);
    });
  });

  describe('Removed Callback Integration', () => {
    it('should store removed callback correctly', () => {
      expect(component.removed).toBe(mockRemovedCallback);
      expect(typeof component.removed).toBe('function');
    });

    it('should handle different callback implementations', () => {
      const customCallback = vi.fn(() => console.log('Custom removed callback'));
      component.removed = customCallback;

      expect(component.removed).toBe(customCallback);
    });

    it('should handle null removed callback', () => {
      component.removed = null as unknown as () => void;
      fixture.detectChanges();

      // Should not cause errors
      expect(component.removed).toBeNull();
    });

    it('should handle undefined removed callback', () => {
      component.removed = undefined as unknown as () => void;
      fixture.detectChanges();

      // Should not cause errors
      expect(component.removed).toBeUndefined();
    });
  });

  describe('Generic Type Support', () => {
    it('should work with different Bean implementations', () => {
      interface AccountBean extends Bean {
        accountNumber: string;
        balance: number;
      }

      class AccountBeanImpl implements AccountBean {
        constructor(
          public id = '',
          public accountNumber = '',
          public balance = 0,
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const accountBean = new AccountBeanImpl('acc-123', 'ACC-001', 2500);
      const accountComponent = new StartUpdateButtonComponent<AccountBeanImpl>();
      accountComponent.item = accountBean;
      accountComponent.routerName = 'accounts';
      accountComponent.removed = vi.fn();

      expect(accountComponent.item.accountNumber).toBe('ACC-001');
      expect(accountComponent.item.balance).toBe(2500);
      expect(accountComponent.item.getId()).toBe('acc-123');
    });

    it('should handle beans with complex properties', () => {
      interface ComplexBean extends Bean {
        metadata: {
          lastModified: Date;
          permissions: string[];
        };
      }

      class ComplexBeanImpl implements ComplexBean {
        constructor(
          public id = '',
          public metadata = { lastModified: new Date(), permissions: [] as string[] },
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const complexBean = new ComplexBeanImpl('complex-456', {
        lastModified: new Date('2023-06-01'),
        permissions: ['read', 'write', 'update'],
      });

      const complexComponent = new StartUpdateButtonComponent<ComplexBeanImpl>();
      complexComponent.item = complexBean;
      complexComponent.routerName = 'complex-entities';
      complexComponent.removed = vi.fn();

      expect(complexComponent.item.metadata.permissions).toEqual(['read', 'write', 'update']);
      expect(complexComponent.item.getId()).toBe('complex-456');
    });
  });

  describe('Router Integration', () => {
    it('should integrate with Angular Router correctly', () => {
      expect(mockRouter).toBeDefined();
      TestUtils.testServiceMethods(mockRouter, ['navigate']);
    });

    it('should handle navigation errors gracefully', () => {
      vi.mocked(mockRouter.navigate).mockRejectedValue(new Error('Navigation failed'));

      // Should not throw an error
      expect(() => component.startUpdate(testBean)).not.toThrow();
      expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should maintain route consistency across multiple navigations', () => {
      const beans = [
        new TestBean('bean-1', 'Bean 1', 100),
        new TestBean('bean-2', 'Bean 2', 200),
        new TestBean('bean-3', 'Bean 3', 300),
      ];

      beans.forEach((bean, index) => {
        component.startUpdate(bean);

        expect(mockRouter.navigate).toHaveBeenNthCalledWith(index + 1, ['test-entities/edit'], {
          state: { bean },
        });
      });
    });
  });

  describe('Component Structure', () => {
    it('should have correct template structure', () => {
      const template = fixture.nativeElement;
      const button = template.querySelector('p-button');

      expect(button).toBeTruthy();
      expect(button.getAttribute('icon')).toBe('pi pi-pencil');
      expect(button.getAttribute('pTooltip')).toBe('Edit the account');
      expect(button.classList.contains('mr-4')).toBe(true);
    });

    it('should use correct PrimeNG button component', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button.tagName.toLowerCase()).toBe('p-button');
    });
  });

  describe('Accessibility', () => {
    it('should have proper tooltip for accessibility', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button.getAttribute('pTooltip')).toBe('Edit the account');
    });

    it('should use semantic icon for edit action', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button.getAttribute('icon')).toBe('pi pi-pencil');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null item gracefully', () => {
      component.item = null as unknown as TestBean;
      fixture.detectChanges();

      // Should not throw error when attempting navigation
      expect(() => component.startUpdate(null as unknown as TestBean)).not.toThrow();
    });

    it('should handle undefined routerName', () => {
      component.routerName = undefined as unknown as string;
      component.startUpdate(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['undefined/edit'], {
        state: { bean: testBean },
      });
    });

    it('should handle empty string routerName', () => {
      component.routerName = '';
      component.startUpdate(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit'], {
        state: { bean: testBean },
      });
    });

    it('should handle special characters in routerName', () => {
      const specialRouterNames = [
        'entities-with-dashes',
        'entities_with_underscores',
        'entities.with.dots',
        'entities/with/slashes',
      ];

      specialRouterNames.forEach((routerName) => {
        component.routerName = routerName;
        component.startUpdate(testBean);

        expect(mockRouter.navigate).toHaveBeenCalledWith([`${routerName}/edit`], {
          state: { bean: testBean },
        });
      });
    });
  });

  describe('Performance', () => {
    it('should handle multiple rapid clicks efficiently', () => {
      const clickCount = 100;
      const startTime = performance.now();

      for (let i = 0; i < clickCount; i++) {
        component.startUpdate(testBean);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete quickly
      expect(mockRouter.navigate).toHaveBeenCalledTimes(clickCount);
    });

    it('should maintain performance with large bean objects', () => {
      const largeBeanData = {
        id: 'large-bean',
        name: 'Large Bean',
        value: 9999,
        largeProperty: Array.from({ length: 10000 }, (_, i) => `data-${i}`).join(','),
      };

      const largeBeanMock = {
        ...largeBeanData,
        getId: () => largeBeanData.id,
      } as unknown as TestBean;

      const startTime = performance.now();
      component.startUpdate(largeBeanMock);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
        state: { bean: largeBeanMock },
      });
    });
  });

  describe('Comparison with StartDetailButtonComponent', () => {
    it('should navigate to edit route instead of detail route', () => {
      component.startUpdate(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/edit'], {
        state: { bean: testBean },
      });

      // Verify it's not calling detail route
      expect(mockRouter.navigate).not.toHaveBeenCalledWith(['test-entities/detail'], {
        state: { bean: testBean },
      });
    });

    it('should use pencil icon instead of search icon', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button.getAttribute('icon')).toBe('pi pi-pencil');
      expect(button.getAttribute('icon')).not.toBe('pi pi-search');
    });

    it('should have edit tooltip instead of detail tooltip', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button.getAttribute('pTooltip')).toBe('Edit the account');
      expect(button.getAttribute('pTooltip')).not.toBe('Detail the account');
    });
  });

  describe('Input Validation', () => {
    it('should work with valid inputs', () => {
      const validBean = new TestBean('valid-123', 'Valid Bean', 500);
      const validRouterName = 'valid-router';
      const validCallback = vi.fn();

      component.item = validBean;
      component.routerName = validRouterName;
      component.removed = validCallback;

      fixture.detectChanges();

      expect(component.item).toBe(validBean);
      expect(component.routerName).toBe(validRouterName);
      expect(component.removed).toBe(validCallback);
    });

    it('should handle minimum valid inputs', () => {
      const minimalBean = new TestBean('min-1', '', 0);
      component.item = minimalBean;
      component.routerName = 'min';
      component.removed = vi.fn();

      fixture.detectChanges();

      expect(component.item.getId()).toBe('min-1');
      expect(component.routerName).toBe('min');
      expect(typeof component.removed).toBe('function');
    });
  });
});
