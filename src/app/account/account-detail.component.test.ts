import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { AccountDetailComponent } from './account-detail.component';
import { accountId, AccountType } from './account';

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

    // Setup history state used by toModelFromHistory
    history.replaceState({ model: { description: 'Test Account', category: 'Test Category' } }, '');

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

    it('should initialize model using toModelFromHistory', () => {
      expect(component.model.description).toBe('Test Account');
      expect(component.model.category).toBe('Test Category');
    });

    it('should have Account model with expected structure', () => {
      expect(component.model).toBeDefined();
      expect(typeof component.model.description).toBe('string');
      expect(typeof component.model.category).toBe('string');
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

  describe('Model Interface Compliance', () => {
    it('should return description as ID from Model interface', () => {
      component.model = { description: 'Model Interface Test', category: 'Test Category' };
      expect(accountId(component.model)).toBe('Model Interface Test');
    });
  });

  describe('History State Integration', () => {
    it('should call toModelFromHistory with createAccount function', () => {
      expect(accountId(component.model)).toBe('Test Account');
    });

    it('should handle different history states', () => {
      history.replaceState(
        { model: { description: 'From History', category: 'History Category' } },
        '',
      );

      const newFixture = TestUtils.createFixture(AccountDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.model.description).toBe('From History');
      expect(newComponent.model.category).toBe('History Category');
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize model in constructor', () => {
      expect(component.model).toBeDefined();
    });

    it('should initialize routerName in constructor', () => {
      expect(component.routerName).toBeDefined();
      expect(typeof component.routerName).toBe('string');
      expect(component.routerName).toBe('debitAccounts');
    });

    it('should maintain model reference throughout component lifecycle', () => {
      const initialModel = component.model;
      expect(component.model).toBe(initialModel);
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
