import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { AccountDetailComponent } from './account-detail.component';
import { Account, createAccount, AccountType } from './account';
import { toBeanFromHistory } from '../bean/bean';

// Mock the toBeanFromHistory function
vi.mock('../bean/bean', () => ({
  toBeanFromHistory: vi.fn(),
}));

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;
  let fixture: ComponentFixture<AccountDetailComponent>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockActivatedRoute: {
    snapshot: {
      data: Record<string, string>;
    };
  };
  let mockToBeanFromHistory: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    // Create ActivatedRoute mock with default type
    mockActivatedRoute = {
      snapshot: {
        data: { type: AccountType.DEBIT },
      },
    };

    // Setup mock for toBeanFromHistory
    mockToBeanFromHistory = vi.mocked(toBeanFromHistory);
    mockToBeanFromHistory.mockReturnValue(new Account('Test Account', 'Test Category'));

    await TestUtils.setupComponentTestBed(AccountDetailComponent, [
      { provide: Router, useValue: mockRouter },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
    ]);

    fixture = TestUtils.createFixture(AccountDetailComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, AccountDetailComponent);
      expect(component).toBeTruthy();
    });

    it('should initialize bean using toBeanFromHistory', () => {
      expect(mockToBeanFromHistory).toHaveBeenCalledWith(createAccount);
      // Note: Called multiple times due to component creation in different tests
      expect(mockToBeanFromHistory.mock.calls.length).toBeGreaterThan(0);
    });

    it('should have Account bean with expected structure', () => {
      expect(component.bean).toBeDefined();
      expect(component.bean).toBeInstanceOf(Account);
      expect(typeof component.bean.getId).toBe('function');
      expect(typeof component.bean.description).toBe('string');
      expect(typeof component.bean.category).toBe('string');
    });

    it('should set bean property correctly', () => {
      const testAccount = new Account('Integration Test Account', 'Integration Category');

      TestUtils.testBasicInputProperties(component, fixture, [
        { key: 'bean', testValue: testAccount },
      ]);

      expect(component.bean.description).toBe('Integration Test Account');
      expect(component.bean.category).toBe('Integration Category');
    });

    it('should set routerName based on account type from ActivatedRoute', () => {
      expect(component.routerName).toBe('debitAccounts');
    });

    it('should handle different account types correctly', () => {
      // Test Credit type
      mockActivatedRoute.snapshot.data['type'] = AccountType.CREDIT;
      const creditFixture = TestUtils.createFixture(AccountDetailComponent);
      expect(creditFixture.componentInstance.routerName).toBe('creditAccounts');

      // Test Equity type
      mockActivatedRoute.snapshot.data['type'] = AccountType.EQUITY;
      const equityFixture = TestUtils.createFixture(AccountDetailComponent);
      expect(equityFixture.componentInstance.routerName).toBe('equityAccounts');

      // Reset to default
      mockActivatedRoute.snapshot.data['type'] = AccountType.DEBIT;
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      component.bean = new Account('Template Test Account', 'Template Category');
      fixture.detectChanges();
    });

    it('should render BeanDetailPanelComponent with correct props', () => {
      // Use helper function pattern for DOM element testing
      const testBeanDetailPanelProps = () => {
        const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));
        expect(beanDetailPanel).toBeTruthy();
        expect(beanDetailPanel.componentInstance.routerName).toBe(component.routerName);
        expect(beanDetailPanel.componentInstance.bean).toBe(component.bean);
      };

      testBeanDetailPanelProps();
    });

    it('should render DetailFieldComponent for description', () => {
      const detailFields = fixture.debugElement.queryAll(By.css('app-detail-field'));

      expect(detailFields.length).toBe(2);
      expect(detailFields[0].componentInstance.strong).toBe('Description');
      expect(detailFields[0].componentInstance.value).toBe('Template Test Account');
    });

    it('should render DetailFieldComponent for category', () => {
      const detailFields = fixture.debugElement.queryAll(By.css('app-detail-field'));

      expect(detailFields.length).toBe(2);
      expect(detailFields[1].componentInstance.strong).toBe('Category');
      expect(detailFields[1].componentInstance.value).toBe('Template Category');
    });

    it('should project DetailFieldComponents inside BeanDetailPanelComponent', () => {
      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));
      const detailFieldsInPanel = beanDetailPanel.queryAll(By.css('app-detail-field'));

      expect(detailFieldsInPanel.length).toBe(2);
      expect(detailFieldsInPanel[0].componentInstance.strong).toBe('Description');
      expect(detailFieldsInPanel[0].componentInstance.value).toBe(component.bean.description);
      expect(detailFieldsInPanel[1].componentInstance.strong).toBe('Category');
      expect(detailFieldsInPanel[1].componentInstance.value).toBe(component.bean.category);
    });

    it('should update DetailFields when bean properties change', async () => {
      // Change bean properties
      component.bean = new Account('Updated Account', 'Updated Category');
      await TestUtils.stabilize(fixture);

      const detailFields = fixture.debugElement.queryAll(By.css('app-detail-field'));
      expect(detailFields[0].componentInstance.value).toBe('Updated Account');
      expect(detailFields[1].componentInstance.value).toBe('Updated Category');
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      component.bean = new Account('Integration Account', 'Integration Category');
      fixture.detectChanges();
    });

    it('should have correct component hierarchy', () => {
      // Test using helper function pattern
      const testComponentHierarchy = () => {
        const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));
        expect(beanDetailPanel).toBeTruthy();

        const detailFields = beanDetailPanel.queryAll(By.css('app-detail-field'));
        expect(detailFields.length).toBe(2);

        const directChildren = fixture.debugElement.children;
        expect(directChildren).toHaveLength(1);
        expect(directChildren[0].nativeElement.tagName.toLowerCase()).toBe('app-bean-detail-panel');
      };

      testComponentHierarchy();
    });

    it('should pass correct routerName to BeanDetailPanelComponent', () => {
      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));

      expect(beanDetailPanel.componentInstance.routerName).toBe('debitAccounts');
    });

    it('should pass bean instance to BeanDetailPanelComponent', async () => {
      const testAccount = new Account('Bean Passing Test', 'Test Category');
      component.bean = testAccount;
      await TestUtils.stabilize(fixture);

      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));

      expect(beanDetailPanel.componentInstance.bean).toBe(testAccount);
      expect(beanDetailPanel.componentInstance.bean.description).toBe('Bean Passing Test');
      expect(beanDetailPanel.componentInstance.bean.category).toBe('Test Category');
    });
  });

  describe('Bean Interface Compliance', () => {
    it('should have bean that implements Bean interface', () => {
      expect(component.bean.getId).toBeDefined();
      expect(typeof component.bean.getId).toBe('function');
    });

    it('should return description as ID from Bean interface', () => {
      component.bean = new Account('Bean Interface Test', 'Test Category');
      expect(component.bean.getId()).toBe('Bean Interface Test');
    });

    it('should work with different account descriptions and categories', () => {
      const testCases = [
        { description: 'Cash', category: 'Assets' },
        { description: 'Revenue', category: 'Income' },
        { description: '', category: '' },
        { description: 'Account with spaces', category: 'Category with spaces' },
      ];

      // Use TestUtils pattern for property testing
      testCases.forEach(({ description, category }) => {
        TestUtils.testBasicInputProperties(component, fixture, [
          { key: 'bean', testValue: new Account(description, category) },
        ]);
        expect(component.bean.getId()).toBe(description);
        expect(component.bean.category).toBe(category);
      });
    });
  });

  describe('Navigation Integration', () => {
    beforeEach(() => {
      component.bean = new Account('Navigation Test Account', 'Test Category');
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

      expect(mockRouter.navigate).toHaveBeenCalledWith(['debitAccounts']);
    });

    it('should enable edit navigation through BeanDetailPanelComponent', async () => {
      const testAccount = new Account('Edit Navigation Test', 'Edit Category');
      component.bean = testAccount;
      await TestUtils.stabilize(fixture);

      TestUtils.testEventHandling(
        fixture,
        'app-bean-detail-panel p-button[icon="pi pi-pencil"]',
        'onClick',
        null,
        mockRouter.navigate,
      );

      expect(mockRouter.navigate).toHaveBeenCalledWith(['debitAccounts/edit'], {
        state: { bean: testAccount },
      });
    });

    it('should navigate with correct router name for different account types', () => {
      // Test with Credit type
      mockActivatedRoute.snapshot.data['type'] = AccountType.CREDIT;
      const creditFixture = TestUtils.createFixture(AccountDetailComponent);
      const creditComponent = creditFixture.componentInstance;
      creditComponent.bean = new Account('Credit Account', 'Credit Category');
      creditFixture.detectChanges();

      TestUtils.testEventHandling(
        creditFixture,
        'app-bean-detail-panel p-button[icon="pi pi-list"]',
        'onClick',
        null,
        mockRouter.navigate,
      );

      expect(mockRouter.navigate).toHaveBeenCalledWith(['creditAccounts']);

      // Reset to default
      mockActivatedRoute.snapshot.data['type'] = AccountType.DEBIT;
    });
  });

  describe('History State Integration', () => {
    it('should call toBeanFromHistory with createAccount function', () => {
      // Component is already created in beforeEach, so toBeanFromHistory was called
      expect(mockToBeanFromHistory).toHaveBeenCalledWith(createAccount);
    });

    it('should handle different history states', () => {
      // Test with different mock returns to simulate different history states
      const mockAccountFromHistory = new Account('From History', 'History Category');
      mockToBeanFromHistory.mockReturnValue(mockAccountFromHistory);

      const newFixture = TestUtils.createFixture(AccountDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean).toBe(mockAccountFromHistory);
      expect(newComponent.bean.description).toBe('From History');
      expect(newComponent.bean.category).toBe('History Category');
    });

    it('should create Account with empty fields when no history state', () => {
      // Mock toBeanFromHistory to return default created account
      mockToBeanFromHistory.mockReturnValue(createAccount());

      const newFixture = TestUtils.createFixture(AccountDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean.description).toBe('');
      expect(newComponent.bean.category).toBe('');
      expect(newComponent.bean.getId()).toBe('');
    });
  });

  describe('Content Projection', () => {
    beforeEach(() => {
      component.bean = new Account('Content Projection Test', 'Projection Category');
      fixture.detectChanges();
    });

    it('should project DetailField content into BeanDetailPanelComponent', () => {
      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));

      // Check that the detail fields are projected inside the panel
      const projectedDetailFields = beanDetailPanel.queryAll(By.css('app-detail-field'));

      expect(projectedDetailFields.length).toBe(2);
      // The projected elements exist within the panel's content area
      expect(projectedDetailFields[0]).toBeDefined();
      expect(projectedDetailFields[0].componentInstance.strong).toBe('Description');
      expect(projectedDetailFields[1]).toBeDefined();
      expect(projectedDetailFields[1].componentInstance.strong).toBe('Category');
    });

    it('should maintain proper binding between component and projected content', async () => {
      const testAccount = new Account('Binding Test Account', 'Binding Category');
      component.bean = testAccount;
      await TestUtils.stabilize(fixture);

      const detailFields = fixture.debugElement.queryAll(By.css('app-detail-field'));

      // Verify the binding is maintained
      expect(detailFields[0].componentInstance.value).toBe(testAccount.description);
      expect(detailFields[0].componentInstance.strong).toBe('Description');
      expect(detailFields[1].componentInstance.value).toBe(testAccount.category);
      expect(detailFields[1].componentInstance.strong).toBe('Category');
    });
  });

  describe('Edge Cases', () => {
    it('should handle Account with null/undefined properties gracefully', () => {
      // Create account with null properties (testing edge case)
      const accountWithNullProps = new Account(
        null as unknown as string,
        undefined as unknown as string,
      );
      mockToBeanFromHistory.mockReturnValue(accountWithNullProps);

      const newFixture = TestUtils.createFixture(AccountDetailComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.bean).toBe(accountWithNullProps);
      expect(() => newFixture.detectChanges()).not.toThrow();
    });

    it('should handle very long account descriptions and categories', () => {
      const longDescription = 'A'.repeat(1000);
      const longCategory = 'B'.repeat(1000);
      component.bean = new Account(longDescription, longCategory);
      fixture.detectChanges();

      const detailFields = fixture.debugElement.queryAll(By.css('app-detail-field'));
      expect(detailFields[0].componentInstance.value).toBe(longDescription);
      expect(detailFields[1].componentInstance.value).toBe(longCategory);
    });

    it('should handle special characters in account properties', () => {
      const specialDescription = 'Account with @#$%^&*()_+ special chars';
      const specialCategory = 'Category with <>&"\'`';
      component.bean = new Account(specialDescription, specialCategory);
      fixture.detectChanges();

      const detailFields = fixture.debugElement.queryAll(By.css('app-detail-field'));
      expect(detailFields[0].componentInstance.value).toBe(specialDescription);
      expect(detailFields[1].componentInstance.value).toBe(specialCategory);
      expect(component.bean.getId()).toBe(specialDescription);
    });

    it('should handle mixed case account types in route data', () => {
      mockActivatedRoute.snapshot.data['type'] = 'CrEdIt';
      const mixedCaseFixture = TestUtils.createFixture(AccountDetailComponent);
      expect(mixedCaseFixture.componentInstance.routerName).toBe('creditAccounts');

      // Reset to default
      mockActivatedRoute.snapshot.data['type'] = AccountType.DEBIT;
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

    it('should initialize routerName in constructor', () => {
      expect(component.routerName).toBeDefined();
      expect(typeof component.routerName).toBe('string');
      expect(component.routerName).toBe('debitAccounts');
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

  describe('RouterName Property', () => {
    it('should format routerName correctly for debit accounts', () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.DEBIT;
      const debitFixture = TestUtils.createFixture(AccountDetailComponent);
      expect(debitFixture.componentInstance.routerName).toBe('debitAccounts');
    });

    it('should format routerName correctly for credit accounts', () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.CREDIT;
      const creditFixture = TestUtils.createFixture(AccountDetailComponent);
      expect(creditFixture.componentInstance.routerName).toBe('creditAccounts');
    });

    it('should format routerName correctly for equity accounts', () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.EQUITY;
      const equityFixture = TestUtils.createFixture(AccountDetailComponent);
      expect(equityFixture.componentInstance.routerName).toBe('equityAccounts');
    });

    it('should use routerName consistently throughout component', () => {
      const routerName = component.routerName;
      fixture.detectChanges();

      const beanDetailPanel = fixture.debugElement.query(By.css('app-bean-detail-panel'));
      expect(beanDetailPanel.componentInstance.routerName).toBe(routerName);
    });
  });
});
