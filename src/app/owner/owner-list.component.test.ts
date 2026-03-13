import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { WritableSignal, signal } from '@angular/core';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { OwnerListComponent } from './owner-list.component';
import { OwnerListService } from './owner-list-service';
import { OwnerRemoveService } from './owner-remove-service';
import { Owner } from './owner';
import { TestUtils } from '../shared/test-utils';
import { AppMessageService } from '../app-message-service';

describe('OwnerListComponent', () => {
  let component: OwnerListComponent;
  let fixture: ComponentFixture<OwnerListComponent>;
  let mockOwnerListService: {
    findAll: ReturnType<typeof vi.fn>;
  };
  let mockOwnerRemoveService: OwnerRemoveService;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockAppMessageService: {
    addErrorMessage: ReturnType<typeof vi.fn>;
    addSuccessMessage: ReturnType<typeof vi.fn>;
  };
  let mockOwnersSignal: WritableSignal<Owner[]>;

  beforeEach(async () => {
    // Create test data
    const testOwners = [new Owner('Owner 1'), new Owner('Owner 2'), new Owner('Owner & Co. Ltd.')];

    // Create signals for reactive data
    mockOwnersSignal = signal(testOwners);

    // Create service mocks
    mockOwnerListService = {
      findAll: vi.fn().mockReturnValue(mockOwnersSignal),
    };

    mockOwnerRemoveService = {
      remove: vi.fn(),
    } as unknown as OwnerRemoveService;

    mockRouter = {
      navigate: vi.fn(),
    };

    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(OwnerListComponent, [
      { provide: OwnerListService, useValue: mockOwnerListService },
      { provide: OwnerRemoveService, useValue: mockOwnerRemoveService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
    ]);

    fixture = TestUtils.createFixture(OwnerListComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(
        component,
        {
          beanName: 'Owner',
          routerName: 'owners',
        },
        OwnerListComponent,
      );
      expect(component).toBeTruthy();
    });

    it('should have correct default properties', () => {
      expect(component.beanName).toBe('Owner');
      expect(component.routerName).toBe('owners');
      expect(component.beanRemoveService).toBe(mockOwnerRemoveService);
      expect(component.beansList).toBe(mockOwnersSignal);
    });

    it('should inject required services', () => {
      expect(component.beanRemoveService).toBeDefined();
      expect(component.beansList).toBeDefined();
      expect(mockOwnerListService.findAll).toHaveBeenCalled();
    });
  });

  describe('Service Integration', () => {
    it('should call OwnerListService.findAll on initialization', () => {
      expect(mockOwnerListService.findAll).toHaveBeenCalled();
      expect(mockOwnerListService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should use OwnerRemoveService instance', () => {
      expect(component.beanRemoveService).toBe(mockOwnerRemoveService);
      expect(component.beanRemoveService).toBeInstanceOf(Object);
    });

    it('should maintain reactive connection to service data', () => {
      const initialOwners = mockOwnersSignal();
      expect(component.beansList()).toBe(initialOwners);

      // Change the signal
      const newOwners = [new Owner('Changed Owner')];
      mockOwnersSignal.set(newOwners);

      // Component should reflect the change
      expect(component.beansList()).toBe(newOwners);
      expect(component.beansList()).not.toBe(initialOwners);
    });
  });

  describe('Component Structure', () => {
    it('should have correct bean configuration', () => {
      expect(component.beanName).toBe('Owner');
      expect(component.routerName).toBe('owners');
    });

    it('should implement required component interface', () => {
      expect(typeof component.beanName).toBe('string');
      expect(typeof component.routerName).toBe('string');
      expect(component.beanRemoveService).toBeDefined();
      expect(component.beansList).toBeDefined();
      expect(typeof component.beansList).toBe('function'); // Signal is a function
    });
  });

  describe('Signal Management', () => {
    it('should handle signal data changes', () => {
      const initialOwners = component.beansList();
      expect(initialOwners.length).toBe(3);

      // Update signal with new data
      const newOwners = [new Owner('New Owner Only')];
      mockOwnersSignal.set(newOwners);

      // Component should reflect the change
      expect(component.beansList().length).toBe(1);
      expect(component.beansList()[0].name).toBe('New Owner Only');
    });

    it('should handle empty owners list', () => {
      mockOwnersSignal.set([]);
      expect(component.beansList().length).toBe(0);
      expect(component.beansList()).toEqual([]);
    });

    it('should handle large datasets', () => {
      const largeOwnerList = Array.from({ length: 100 }, (_, i) => new Owner(`Owner ${i + 1}`));
      mockOwnersSignal.set(largeOwnerList);

      expect(component.beansList().length).toBe(100);
      expect(component.beansList()[0].name).toBe('Owner 1');
      expect(component.beansList()[99].name).toBe('Owner 100');
    });

    it('should handle rapid data changes', () => {
      for (let i = 0; i < 5; i++) {
        const newOwners = Array.from(
          { length: i + 1 },
          (_, j) => new Owner(`Rapid Owner ${i}-${j}`),
        );
        mockOwnersSignal.set(newOwners);
      }

      expect(component.beansList().length).toBe(5);
      expect(component.beansList()[0].name).toBe('Rapid Owner 4-0');
    });
  });
});
