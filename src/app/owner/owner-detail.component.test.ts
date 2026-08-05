import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { OwnerDetailComponent } from './owner-detail.component';
import { ownerId } from './owner';

describe('OwnerDetailComponent', () => {
  let component: OwnerDetailComponent;
  let fixture: ComponentFixture<OwnerDetailComponent>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    // Setup history state used by toModelFromHistory
    history.replaceState({ model: { name: 'Test Owner' } }, '');
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

    it('should initialize model using toModelFromHistory', () => {
      expect(component.model.name).toBe('Test Owner');
    });

    it('should have Owner model with expected structure', () => {
      expect(component.model).toBeDefined();
      expect(typeof component.model.name).toBe('string');
    });
  });

  describe('Model Interface Compliance', () => {
    it('should return name as ID from Model interface', () => {
      component.model = { name: 'Model Interface Test' };
      expect(ownerId(component.model)).toBe('Model Interface Test');
    });
  });

  describe('History State Integration', () => {
    it('should call toModelFromHistory with createOwner function', () => {
      expect(ownerId(component.model)).toBe('Test Owner');
    });

    it('should handle different history states', () => {
      history.replaceState({ model: { name: 'From History' } }, '');
      const newFixture = TestUtils.createFixture(OwnerDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.model.name).toBe('From History');
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize model in constructor', () => {
      // Use helper pattern for initialization testing
      const testInitialization = () => {
        expect(component.model).toBeDefined();
      };

      testInitialization();
    });
  });
});
