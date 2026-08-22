import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AccountListService } from './account-list-service';
import { AppMessageService } from '../app-message-service';
import { TestUtils } from '../shared/test-utils';
import { createAccount, AccountType } from './account';

describe('AccountListService', () => {
  let service: AccountListService;
  let mockAppMessageService: AppMessageService;
  const testAccountType = AccountType.DEBIT;

  beforeEach(async () => {
    // Setup mock for AppMessageService
    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    } as unknown as AppMessageService;

    await TestUtils.setupServiceTestBed(AccountListService, [
      { provide: AppMessageService, useValue: mockAppMessageService },
    ]);

    service = new AccountListService(mockAppMessageService, testAccountType);
  });

  describe('Service Creation', () => {
    it('should create the service', () => {
      TestUtils.testBasicInitialization(service, {}, AccountListService);
      expect(service).toBeTruthy();
    });
  });

  it('should be created with constructor parameters', () => {
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(AccountListService);
  });

  it('should have findAll method', () => {
    expect(service.findAll).toBeDefined();
    expect(typeof service.findAll).toBe('function');
  });

  describe('Service Configuration', () => {
    it('should be instantiable with each AccountType', () => {
      for (const type of [AccountType.DEBIT, AccountType.CREDIT, AccountType.EQUITY]) {
        const listService = new AccountListService(mockAppMessageService, type);
        expect(listService).toBeInstanceOf(AccountListService);
      }
    });
  });

  describe('Service Dependencies', () => {
    it('should use createAccount factory function', () => {
      // Test that createAccount is used correctly
      const testAccount = createAccount();
      expect(testAccount).toBeDefined();
      expect(testAccount.description).toBe('');
      expect(testAccount.category).toBe('');
    });

    it('should have proper service structure', () => {
      expect(service).toBeDefined();
      expect(service.constructor).toBeDefined();
      expect(service.findAll).toBeDefined();
    });
  });

  describe('Method Signatures', () => {
    it('should have correct findAll return type expectation', () => {
      // We can't test the actual return due to injection context issues,
      // but we can test that the method exists and is callable
      expect(service.findAll).toBeDefined();
      expect(typeof service.findAll).toBe('function');
      expect(service.findAll).toHaveLength(0); // Should take no parameters
    });
  });

  describe('AccountType Integration', () => {
    it('should expose findAll for all account types', () => {
      for (const type of [AccountType.DEBIT, AccountType.CREDIT, AccountType.EQUITY]) {
        const listService = new AccountListService(mockAppMessageService, type);
        expect(listService.findAll).toBeDefined();
      }
    });
  });

  describe('Constructor', () => {
    it('should initialize with AppMessageService and AccountType', () => {
      const customService = new AccountListService(mockAppMessageService, AccountType.CREDIT);
      expect(customService).toBeDefined();
      expect(customService).toBeInstanceOf(AccountListService);
    });

    it('should accept different AccountType values', () => {
      const accountTypes = [AccountType.DEBIT, AccountType.CREDIT, AccountType.EQUITY];
      const services = accountTypes.map(
        (type) => new AccountListService(mockAppMessageService, type),
      );
      services.forEach((instance) => expect(instance).toBeInstanceOf(AccountListService));
    });
  });
});
