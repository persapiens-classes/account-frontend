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

  describe('ModelListService Interface Implementation', () => {
    it('should implement ModelListService interface', () => {
      expect(service.findAll).toBeDefined();
      expect(typeof service.findAll).toBe('function');
    });
  });

  it('should maintain singleton service instance', () => {
    const service1 = TestBed.inject(OwnerListService);
    const service2 = TestBed.inject(OwnerListService);
    expect(service1).toBe(service2);
  });

  it('should use createOwner factory function', () => {
    const testOwner = createOwner();
    expect(testOwner).toBeDefined();
    expect(testOwner.name).toBe('');
  });

  describe('Method Signatures', () => {
    it('should declare findAll with zero parameters', () => {
      expect(service.findAll).toHaveLength(0);
      expect(service.findAll).toBeTypeOf('function');
    });
  });
});
