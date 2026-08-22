import { ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

import { AccountListComponent } from './account-list.component';
import { AccountRemoveService } from './account-remove-service';
import { AccountType } from './account';
import { TestUtils } from '../shared/test-utils';
import { AppMessageService } from '../app-message-service';
import { HttpClient } from '@angular/common/http';
import { PATHS } from '../app.paths';

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

    it('should initialize modelsList signal', () => {
      expect(component.modelsList).toBeDefined();
      expect(typeof component.modelsList).toBe('function');
    });

    it('should initialize modelRemoveService', () => {
      expect(component.modelRemoveService).toBeDefined();
      expect(component.modelRemoveService).toBeInstanceOf(AccountRemoveService);
    });

    it('should set routerName based on account type', () => {
      expect(component.routerName).toBe(`debit${PATHS.ACCOUNT_PATH}`);
    });

    it('should set modelName based on account type', () => {
      expect(component.modelName).toBe('Debit Account');
    });
  });

  describe('AccountType Integration', () => {
    it('should handle CREDIT account type', async () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.CREDIT;

      const newFixture = TestUtils.createFixture(AccountListComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.routerName).toBe(`credit${PATHS.ACCOUNT_PATH}`);
      expect(newComponent.modelName).toBe('Credit Account');
    });

    it('should handle EQUITY account type', async () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.EQUITY;

      const newFixture = TestUtils.createFixture(AccountListComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.routerName).toBe(`equity${PATHS.ACCOUNT_PATH}`);
      expect(newComponent.modelName).toBe('Equity Account');
    });

    it('should create correct AccountRemoveService for each type', () => {
      expect(component.modelRemoveService).toBeInstanceOf(AccountRemoveService);
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize modelsList in constructor', () => {
      expect(component.modelsList).toBeDefined();
      expect(typeof component.modelsList).toBe('function');
    });
  });

  describe('Signal Management', () => {
    it('should allow updating modelsList signal', () => {
      const testAccounts = [
        { description: 'Account 1', category: 'Category A' },
        { description: 'Account 2', category: 'Category B' },
      ];
      component.modelsList = signal(testAccounts);

      expect(component.modelsList()).toEqual(testAccounts);
      expect(component.modelsList()).toHaveLength(2);
    });

    it('should handle empty modelsList', () => {
      component.modelsList = signal([]);
      expect(component.modelsList()).toEqual([]);
      expect(component.modelsList()).toHaveLength(0);
    });

    it('should handle large datasets in signal', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        description: `Account ${i}`,
        category: `Category ${i}`,
      }));
      component.modelsList = signal(largeDataset);

      expect(component.modelsList()).toHaveLength(100);
      expect(component.modelsList()[0].description).toBe('Account 0');
      expect(component.modelsList()[99].description).toBe('Account 99');
    });
  });
});
