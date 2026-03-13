import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { OwnerDetailComponent } from './owner-detail.component';
import { Owner } from './owner';

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

    // Setup history state used by toBeanFromHistory
    history.replaceState({ bean: { name: 'Test Owner' } }, '');
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
      expect(component.bean.name).toBe('Test Owner');
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
      expect(component.bean.getId()).toBe('Test Owner');
    });

    it('should handle different history states', () => {
      history.replaceState({ bean: { name: 'From History' } }, '');
      const newFixture = TestUtils.createFixture(OwnerDetailComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.bean.name).toBe('From History');
    });

    it('should create Owner with empty name when no history state', () => {
      // Simulate missing history state
      history.replaceState({}, '');
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
      };

      testInitialization();
    });
  });
});
