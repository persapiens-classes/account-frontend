import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';
import { BeanListPanelComponent } from './bean-list-panel.component';

describe('BeanListPanelComponent', () => {
  let component: BeanListPanelComponent;
  let fixture: ComponentFixture<BeanListPanelComponent>;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create router mock
    mockRouter = {
      navigate: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(BeanListPanelComponent, [
      { provide: Router, useValue: mockRouter },
    ]);

    fixture = TestUtils.createFixture(BeanListPanelComponent);
    component = fixture.componentInstance;

    // Set required input using ComponentRef.setInput
    fixture.componentRef.setInput('routerName', 'test-entities');
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
