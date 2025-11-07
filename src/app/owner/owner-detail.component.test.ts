import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { OwnerDetailComponent } from './owner-detail.component';
import { Owner, createOwner } from './owner';
import { toBeanFromHistory } from '../bean/bean';

// Mock the toBeanFromHistory function
vi.mock('../bean/bean', () => ({
  toBeanFromHistory: vi.fn(),
}));

describe('OwnerDetailComponent', () => {
  let component: OwnerDetailComponent;
  let fixture: ComponentFixture<OwnerDetailComponent>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockToBeanFromHistory: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    // Setup mock for toBeanFromHistory
    mockToBeanFromHistory = vi.mocked(toBeanFromHistory);
    mockToBeanFromHistory.mockReturnValue(new Owner('Test Owner'));

    await TestUtils.setupComponentTestBed(OwnerDetailComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(OwnerDetailComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, OwnerDetailComponent);
    });

    it('should initialize bean using toBeanFromHistory', () => {
      expect(mockToBeanFromHistory).toHaveBeenCalledWith(createOwner);
      // Note: Called multiple times due to component creation in different tests
      expect(mockToBeanFromHistory.mock.calls.length).toBeGreaterThan(0);
    });

    it('should have Owner bean with expected structure', () => {
      expect(component.bean).toBeDefined();
      expect(component.bean).toBeInstanceOf(Owner);
      expect(typeof component.bean.getId).toBe('function');
      expect(typeof component.bean.name).toBe('string');
    });
  });

  describe('Bean Interface Compliance', () => {
    it('should have bean that implements Bean interface', () => {
      expect(component.bean.getId).toBeDefined();
      expect(typeof component.bean.getId).toBe('function');
    });

    it('should return name as ID from Bean interface', () => {
      component.bean = new Owner('Bean Interface Test');
      expect(component.bean.getId()).toBe('Bean Interface Test');
    });
  });

  describe('History State Integration', () => {
    it('should call toBeanFromHistory with createOwner function', () => {
      // Component is already created in beforeEach, so toBeanFromHistory was called
      expect(mockToBeanFromHistory).toHaveBeenCalledWith(createOwner);
    });

    it('should handle different history states', () => {
      // Test with different mock returns to simulate different history states
      const mockOwnerFromHistory = new Owner('From History');
      mockToBeanFromHistory.mockReturnValue(mockOwnerFromHistory);

      const newFixture = TestUtils.createFixture(OwnerDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean).toBe(mockOwnerFromHistory);
      expect(newComponent.bean.name).toBe('From History');
    });

    it('should create Owner with empty name when no history state', () => {
      // Mock toBeanFromHistory to return default created owner
      mockToBeanFromHistory.mockReturnValue(createOwner());

      const newFixture = TestUtils.createFixture(OwnerDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean.name).toBe('');
      expect(newComponent.bean.getId()).toBe('');
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
  });
});
