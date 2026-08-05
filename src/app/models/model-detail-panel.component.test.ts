import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { ModelDetailPanelComponent } from './model-detail-panel.component';

// Test implementation of Model interface
interface TestModel {
  id: string;
  name: string;
  value: number;
}

describe('ModelDetailPanelComponent', () => {
  let component: ModelDetailPanelComponent<TestModel>;
  let fixture: ComponentFixture<ModelDetailPanelComponent<TestModel>>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(ModelDetailPanelComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(ModelDetailPanelComponent<TestModel>);
    component = fixture.componentInstance;

    // Set required inputs using ComponentRef.setInput
    fixture.componentRef.setInput('routerName', 'test-entities');
    fixture.componentRef.setInput('model', { id: 'test-123', name: 'Test Entity', value: 100 });
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
