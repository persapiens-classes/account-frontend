import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
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
      expect(mockToBeanFromHistory.mock.calls.length).toBeGreaterThan(0);
    });

    it('should have Account bean with expected structure', () => {
      expect(component.bean).toBeDefined();
      expect(component.bean).toBeInstanceOf(Account);
      expect(typeof component.bean.getId).toBe('function');
      expect(typeof component.bean.description).toBe('string');
      expect(typeof component.bean.category).toBe('string');
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

  describe('Bean Interface Compliance', () => {
    it('should have bean that implements Bean interface', () => {
      expect(component.bean.getId).toBeDefined();
      expect(typeof component.bean.getId).toBe('function');
    });

    it('should return description as ID from Bean interface', () => {
      component.bean = new Account('Bean Interface Test', 'Test Category');
      expect(component.bean.getId()).toBe('Bean Interface Test');
    });
  });

  describe('History State Integration', () => {
    it('should call toBeanFromHistory with createAccount function', () => {
      expect(mockToBeanFromHistory).toHaveBeenCalledWith(createAccount);
    });

    it('should handle different history states', () => {
      const mockAccountFromHistory = new Account('From History', 'History Category');
      mockToBeanFromHistory.mockReturnValue(mockAccountFromHistory);

      const newFixture = TestUtils.createFixture(AccountDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean).toBe(mockAccountFromHistory);
      expect(newComponent.bean.description).toBe('From History');
      expect(newComponent.bean.category).toBe('History Category');
    });

    it('should create Account with empty fields when no history state', () => {
      mockToBeanFromHistory.mockReturnValue(createAccount());

      const newFixture = TestUtils.createFixture(AccountDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean.description).toBe('');
      expect(newComponent.bean.category).toBe('');
      expect(newComponent.bean.getId()).toBe('');
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize bean in constructor', () => {
      expect(component.bean).toBeDefined();
      expect(mockToBeanFromHistory).toHaveBeenCalled();
    });

    it('should initialize routerName in constructor', () => {
      expect(component.routerName).toBeDefined();
      expect(typeof component.routerName).toBe('string');
      expect(component.routerName).toBe('debitAccounts');
    });

    it('should maintain bean reference throughout component lifecycle', () => {
      const initialBean = component.bean;
      expect(component.bean).toBe(initialBean);
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
  });
});
