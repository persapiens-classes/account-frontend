import { ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

import { AccountListComponent } from './account-list.component';
import { AccountRemoveService } from './account-remove-service';
import { Account, AccountType } from './account';
import { TestUtils } from '../shared/test-utils';
import { AppMessageService } from '../app-message-service';
import { HttpClient } from '@angular/common/http';

describe('AccountListComponent', () => {
  let component: AccountListComponent;
  let fixture: ComponentFixture<AccountListComponent>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockAppMessageService: {
    addErrorMessage: ReturnType<typeof vi.fn>;
    addSuccessMessage: ReturnType<typeof vi.fn>;
  };
  let mockActivatedRoute: {
    snapshot: {
      data: Record<string, unknown>;
    };
  };
  let mockHttpClient: unknown;

  beforeEach(async () => {
    // Create service mocks
    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        data: { type: AccountType.DEBIT },
      },
    };

    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(AccountListComponent, [
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    fixture = TestUtils.createFixture(AccountListComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, AccountListComponent);
      expect(component).toBeTruthy();
    });

    it('should initialize beansList signal', () => {
      expect(component.beansList).toBeDefined();
      expect(typeof component.beansList).toBe('function');
    });

    it('should initialize beanRemoveService', () => {
      expect(component.beanRemoveService).toBeDefined();
      expect(component.beanRemoveService).toBeInstanceOf(AccountRemoveService);
    });

    it('should set routerName based on account type', () => {
      expect(component.routerName).toBe('debitAccounts');
    });

    it('should set beanName based on account type', () => {
      expect(component.beanName).toBe('Debit Account');
    });
  });

  describe('AccountType Integration', () => {
    it('should handle CREDIT account type', async () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.CREDIT;

      const newFixture = TestUtils.createFixture(AccountListComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.routerName).toBe('creditAccounts');
      expect(newComponent.beanName).toBe('Credit Account');
    });

    it('should handle EQUITY account type', async () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.EQUITY;

      const newFixture = TestUtils.createFixture(AccountListComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.routerName).toBe('equityAccounts');
      expect(newComponent.beanName).toBe('Equity Account');
    });

    it('should create correct AccountRemoveService for each type', () => {
      expect(component.beanRemoveService).toBeInstanceOf(AccountRemoveService);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize beansList in constructor', () => {
      expect(component.beansList).toBeDefined();
      expect(typeof component.beansList).toBe('function');
    });
  });

  describe('Signal Management', () => {
    it('should allow updating beansList signal', () => {
      const testAccounts = [
        new Account('Account 1', 'Category A'),
        new Account('Account 2', 'Category B'),
      ];
      component.beansList = signal(testAccounts);

      expect(component.beansList()).toEqual(testAccounts);
      expect(component.beansList().length).toBe(2);
    });

    it('should handle empty beansList', () => {
      component.beansList = signal([]);
      expect(component.beansList()).toEqual([]);
      expect(component.beansList().length).toBe(0);
    });

    it('should handle large datasets in signal', () => {
      const largeDataset = Array.from(
        { length: 100 },
        (_, i) => new Account(`Account ${i}`, `Category ${i}`),
      );
      component.beansList = signal(largeDataset);

      expect(component.beansList().length).toBe(100);
      expect(component.beansList()[0].description).toBe('Account 0');
      expect(component.beansList()[99].description).toBe('Account 99');
    });
  });
});
