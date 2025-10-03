import { ComponentFixture } from '@angular/core/testing';
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { Router } from '@angular/router';
import { StartDetailButtonComponent } from './start-detail-button.component';
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

describe('StartDetailButtonComponent', () => {
  let component: StartDetailButtonComponent<TestBean>;
  let fixture: ComponentFixture<StartDetailButtonComponent<TestBean>>;
  let mockRouter: Router;
  let testBean: TestBean;

  beforeEach(async () => {
    // Setup mock router
    mockRouter = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
      url: '/test',
      events: vi.fn(),
    } as unknown as Router;

    // Create test data
    testBean = new TestBean('detail-123', 'Detail Bean', 150);

    await TestUtils.setupComponentTestBed(StartDetailButtonComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(StartDetailButtonComponent) as ComponentFixture<
      StartDetailButtonComponent<TestBean>
    >;
    component = fixture.componentInstance;

    // Set component inputs
    component.item = testBean;
    component.routerName = 'test-entities';

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(
        component,
        {
          item: testBean,
          routerName: 'test-entities',
        },
        StartDetailButtonComponent,
      );
      expect(component).toBeTruthy();
    });

    it('should render detail button with correct properties', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button).toBeTruthy();
      expect(button.getAttribute('icon')).toBe('pi pi-search');
      expect(button.getAttribute('pTooltip')).toBe('Detail the account');
      expect(button.classList.contains('mr-4')).toBe(true);
    });
  });

  describe('Input Properties', () => {
    it('should accept item input', () => {
      const newItem = new TestBean('new-detail-456', 'New Detail Bean', 250);

      TestUtils.testBasicInputProperties(component, fixture, [{ key: 'item', testValue: newItem }]);

      expect(component.item).toBe(newItem);
      expect(component.item.getId()).toBe('new-detail-456');
    });

    it('should accept routerName input', () => {
      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'routerName', testValue: 'custom-router' },
      ]);

      expect(component.routerName).toBe('custom-router');
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
    it('should navigate to detail route when startDetail is called', () => {
      component.startDetail(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/detail'], {
        state: { bean: testBean },
      });
    });

    it('should navigate with correct route structure', () => {
      component.routerName = 'custom-entities';
      component.startDetail(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['custom-entities/detail'], {
        state: { bean: testBean },
      });
    });

    it('should pass bean in navigation state', () => {
      const customBean = new TestBean('state-789', 'State Bean', 300);
      component.item = customBean;
      component.startDetail(customBean);

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
      const customComponent = new StartDetailButtonComponent<CustomBeanImpl>();
      customComponent.item = customBean;
      customComponent.routerName = 'custom-beans';

      // Inject router manually since this is a standalone instance
      (customComponent as unknown as { router: Router }).router = mockRouter;

      customComponent.startDetail(customBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['custom-beans/detail'], {
        state: { bean: customBean },
      });
    });
  });

  describe('Event Handling', () => {
    it('should handle click events on detail button', () => {
      const mockStartDetail = vi.spyOn(component, 'startDetail');
      const mockCallback = vi.fn();
      mockStartDetail.mockImplementation(mockCallback);

      TestUtils.testEventHandling(
        fixture,
        'p-button',
        'onClick',
        new MouseEvent('click'),
        mockCallback,
      );

      expect(mockStartDetail).toHaveBeenCalled();
    });

    it('should call startDetail with correct item when button is clicked', () => {
      const mockStartDetail = vi.spyOn(component, 'startDetail');
      const button = fixture.nativeElement.querySelector('p-button');

      button.click();

      expect(mockStartDetail).toHaveBeenCalledWith(testBean);
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

      const accountBean = new AccountBeanImpl('acc-123', 'ACC-001', 1500);
      const accountComponent = new StartDetailButtonComponent<AccountBeanImpl>();
      accountComponent.item = accountBean;
      accountComponent.routerName = 'accounts';

      expect(accountComponent.item.accountNumber).toBe('ACC-001');
      expect(accountComponent.item.balance).toBe(1500);
      expect(accountComponent.item.getId()).toBe('acc-123');
    });

    it('should handle beans with complex properties', () => {
      interface ComplexBean extends Bean {
        metadata: {
          createdAt: Date;
          tags: string[];
        };
      }

      class ComplexBeanImpl implements ComplexBean {
        constructor(
          public id = '',
          public metadata = { createdAt: new Date(), tags: [] as string[] },
        ) {}

        getId(): string {
          return this.id;
        }
      }

      const complexBean = new ComplexBeanImpl('complex-456', {
        createdAt: new Date('2023-01-01'),
        tags: ['important', 'urgent'],
      });

      const complexComponent = new StartDetailButtonComponent<ComplexBeanImpl>();
      complexComponent.item = complexBean;
      complexComponent.routerName = 'complex-entities';

      expect(complexComponent.item.metadata.tags).toEqual(['important', 'urgent']);
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
      expect(() => component.startDetail(testBean)).not.toThrow();
      expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should maintain route consistency across multiple navigations', () => {
      const beans = [
        new TestBean('bean-1', 'Bean 1', 100),
        new TestBean('bean-2', 'Bean 2', 200),
        new TestBean('bean-3', 'Bean 3', 300),
      ];

      beans.forEach((bean, index) => {
        component.startDetail(bean);

        expect(mockRouter.navigate).toHaveBeenNthCalledWith(index + 1, ['test-entities/detail'], {
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
      expect(button.getAttribute('icon')).toBe('pi pi-search');
      expect(button.getAttribute('pTooltip')).toBe('Detail the account');
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
      expect(button.getAttribute('pTooltip')).toBe('Detail the account');
    });

    it('should use semantic icon for detail action', () => {
      const button = fixture.nativeElement.querySelector('p-button');
      expect(button.getAttribute('icon')).toBe('pi pi-search');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null item gracefully', () => {
      component.item = null as unknown as TestBean;
      fixture.detectChanges();

      // Should not throw error when attempting navigation
      expect(() => component.startDetail(null as unknown as TestBean)).not.toThrow();
    });

    it('should handle undefined routerName', () => {
      component.routerName = undefined as unknown as string;
      component.startDetail(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['undefined/detail'], {
        state: { bean: testBean },
      });
    });

    it('should handle empty string routerName', () => {
      component.routerName = '';
      component.startDetail(testBean);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/detail'], {
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
        component.startDetail(testBean);

        expect(mockRouter.navigate).toHaveBeenCalledWith([`${routerName}/detail`], {
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
        component.startDetail(testBean);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete quickly
      expect(mockRouter.navigate).toHaveBeenCalledTimes(clickCount);
    });

    it('should maintain performance with large bean objects', () => {
      const largeBeanData = {
        id: 'large-bean',
        largeProperty: Array.from({ length: 10000 }, (_, i) => `data-${i}`).join(','),
      };

      const largeBeanMock = {
        ...largeBeanData,
        name: 'Large Bean',
        value: 9999,
        getId: () => largeBeanData.id,
      } as unknown as TestBean;

      const startTime = performance.now();
      component.startDetail(largeBeanMock);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
      expect(mockRouter.navigate).toHaveBeenCalledWith(['test-entities/detail'], {
        state: { bean: largeBeanMock },
      });
    });
  });
});
