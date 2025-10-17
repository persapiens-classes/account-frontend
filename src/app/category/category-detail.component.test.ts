import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoryDetailComponent } from './category-detail.component';
import { TestUtils } from '../shared/test-utils';
import { CategoryType, Category } from './category';
import { AppMessageService } from '../app-message-service';

describe('CategoryDetailComponent for DEBIT', () => {
  let fixture: ComponentFixture<CategoryDetailComponent>;
  let component: CategoryDetailComponent;

  beforeEach(async () => {
    const mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    const activatedRoute = {
      snapshot: {
        data: { type: CategoryType.DEBIT },
      },
    };

    const mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    // Mock history.state with a category bean
    window.history.replaceState(
      { bean: { id: 1, description: 'Test Debit Category' } },
      '',
      window.location.href,
    );

    await TestUtils.setupComponentTestBed(CategoryDetailComponent, [
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    fixture = TestUtils.createFixture(CategoryDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "debitCategories"', () => {
    expect(component.routerName).toBe('debitCategories');
  });

  it('should have bean property', () => {
    expect(component.bean).toBeDefined();
  });

  describe.skip('Template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element).toBeTruthy();
    });
  });
});

describe('CategoryDetailComponent for CREDIT', () => {
  let fixture: ComponentFixture<CategoryDetailComponent>;
  let component: CategoryDetailComponent;

  beforeEach(async () => {
    const mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    const activatedRoute = {
      snapshot: {
        data: { type: CategoryType.CREDIT },
      },
    };

    const mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    // Mock history.state with a category bean
    window.history.replaceState(
      { bean: { id: 2, description: 'Test Credit Category' } },
      '',
      window.location.href,
    );

    await TestUtils.setupComponentTestBed(CategoryDetailComponent, [
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    fixture = TestUtils.createFixture(CategoryDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "creditCategories"', () => {
    expect(component.routerName).toBe('creditCategories');
  });

  it('should have bean property', () => {
    expect(component.bean).toBeDefined();
  });
});

describe('CategoryDetailComponent for EQUITY', () => {
  let fixture: ComponentFixture<CategoryDetailComponent>;
  let component: CategoryDetailComponent;

  beforeEach(async () => {
    const mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    const activatedRoute = {
      snapshot: {
        data: { type: CategoryType.EQUITY },
      },
    };

    const mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    // Mock history.state with a category bean
    window.history.replaceState(
      { bean: { id: 3, description: 'Test Equity Category' } },
      '',
      window.location.href,
    );

    await TestUtils.setupComponentTestBed(CategoryDetailComponent, [
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    fixture = TestUtils.createFixture(CategoryDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "equityCategories"', () => {
    expect(component.routerName).toBe('equityCategories');
  });

  it('should have bean property', () => {
    expect(component.bean).toBeDefined();
  });
});
