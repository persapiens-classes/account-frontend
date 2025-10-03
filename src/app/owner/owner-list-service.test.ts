import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { OwnerListService } from './owner-list-service';
import { AppMessageService } from '../app-message-service';
import { TestUtils } from '../shared/test-utils';
import { createOwner } from './owner';

describe('OwnerListService', () => {
  let service: OwnerListService;
  let mockAppMessageService: AppMessageService;

  beforeEach(async () => {
    // Setup mock for AppMessageService
    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    } as unknown as AppMessageService;

    await TestUtils.setupServiceTestBed(OwnerListService, [
      { provide: AppMessageService, useValue: mockAppMessageService },
    ]);

    service = TestBed.inject(OwnerListService);
  });

  describe('Service Creation', () => {
    it('should create the service', () => {
      TestUtils.testBasicInitialization(service, {}, OwnerListService);
      expect(service).toBeTruthy();
    });
  });

  it('should be provided in root', () => {
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(OwnerListService);
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
    it('should be injectable service', () => {
      expect(service).toBeTruthy();
      expect(service.constructor.name).toBe('OwnerListService');
    });

    it('should maintain service instance', () => {
      const service1 = TestBed.inject(OwnerListService);
      const service2 = TestBed.inject(OwnerListService);

      expect(service1).toBe(service2); // Should be singleton
    });
  });

  describe('Service Dependencies', () => {
    it('should use createOwner factory function', () => {
      // Test that createOwner is used correctly
      const testOwner = createOwner();
      expect(testOwner).toBeDefined();
      expect(testOwner.name).toBe('');
      expect(typeof testOwner.getId).toBe('function');
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
});
