import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { BeanDetailPanelComponent } from './bean-detail-panel.component';
import { Bean } from './bean';

// Test implementation of Bean interface
class TestBean implements Bean {
  constructor(
    public id = 'test-id',
    public name = 'Test Bean',
  ) {}

  getId(): string {
    return this.id;
  }
}

describe('BeanDetailPanelComponent', () => {
  let component: BeanDetailPanelComponent<TestBean>;
  let fixture: ComponentFixture<BeanDetailPanelComponent<TestBean>>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(BeanDetailPanelComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(BeanDetailPanelComponent<TestBean>);
    component = fixture.componentInstance;

    // Set required inputs using ComponentRef.setInput
    fixture.componentRef.setInput('routerName', 'test-entities');
    fixture.componentRef.setInput('bean', new TestBean('test-123', 'Test Entity'));
  });

  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      expect(component).toBeTruthy();
    });

    it('should inject Router service', () => {
      expect(component['router']).toBeDefined();
      expect(component['router']).toBe(mockRouter);
    });
  });
});
