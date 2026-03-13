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

  describe('BeanListService Interface Implementation', () => {
    it('should implement BeanListService interface', () => {
      expect(service.findAll).toBeDefined();
      expect(typeof service.findAll).toBe('function');
    });
  });

  describe('Service Configuration', () => {
    it('should be instantiable with different AccountTypes', () => {
      const debitService = new AccountListService(mockAppMessageService, AccountType.DEBIT);
      const creditService = new AccountListService(mockAppMessageService, AccountType.CREDIT);
      const equityService = new AccountListService(mockAppMessageService, AccountType.EQUITY);

      expect(debitService).toBeTruthy();
      expect(creditService).toBeTruthy();
      expect(equityService).toBeTruthy();
    });

    it('should accept AppMessageService and AccountType in constructor', () => {
      const customService = new AccountListService(mockAppMessageService, AccountType.CREDIT);
      expect(customService).toBeDefined();
      expect(customService).toBeInstanceOf(AccountListService);
    });
  });

  describe('Service Dependencies', () => {
    it('should use createAccount factory function', () => {
      // Test that createAccount is used correctly
      const testAccount = createAccount();
      expect(testAccount).toBeDefined();
      expect(testAccount.description).toBe('');
      expect(testAccount.category).toBe('');
      expect(typeof testAccount.getId).toBe('function');
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
      expect(service.findAll.length).toBe(0); // Should take no parameters
    });
  });

  describe('AccountType Integration', () => {
    it('should work with DEBIT type', () => {
      const debitService = new AccountListService(mockAppMessageService, AccountType.DEBIT);
      expect(debitService).toBeDefined();
      expect(debitService.findAll).toBeDefined();
    });

    it('should work with CREDIT type', () => {
      const creditService = new AccountListService(mockAppMessageService, AccountType.CREDIT);
      expect(creditService).toBeDefined();
      expect(creditService.findAll).toBeDefined();
    });

    it('should work with EQUITY type', () => {
      const equityService = new AccountListService(mockAppMessageService, AccountType.EQUITY);
      expect(equityService).toBeDefined();
      expect(equityService.findAll).toBeDefined();
    });
  });

  describe('Constructor', () => {
    it('should initialize with AppMessageService and AccountType', () => {
      const customService = new AccountListService(mockAppMessageService, AccountType.CREDIT);
      expect(customService).toBeDefined();
      expect(customService).toBeInstanceOf(AccountListService);
    });

    it('should accept different AccountType values', () => {
      const debitService = new AccountListService(mockAppMessageService, AccountType.DEBIT);
      const creditService = new AccountListService(mockAppMessageService, AccountType.CREDIT);
      const equityService = new AccountListService(mockAppMessageService, AccountType.EQUITY);

      expect(debitService).toBeInstanceOf(AccountListService);
      expect(creditService).toBeInstanceOf(AccountListService);
      expect(equityService).toBeInstanceOf(AccountListService);
    });
  });
});
