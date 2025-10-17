import { ComponentFixture } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { CategoryUpdateComponent } from './category-update.component';
import { CategoryUpdateService } from './category-update-service';
import { TestUtils } from '../shared/test-utils';
import { CategoryType, Category } from './category';
import { AppMessageService } from '../app-message-service';

describe('CategoryUpdateComponent for DEBIT', () => {
  let fixture: ComponentFixture<CategoryUpdateComponent>;
  let component: CategoryUpdateComponent;

  beforeEach(async () => {
    const mockCategoryUpdateService = {
      update: vi.fn().mockReturnValue(of(new Category('Updated Category'))),
      http: vi.fn(),
    };

    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

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

    // Mock history.state with a category
    window.history.replaceState({ id: 1, description: 'Test Category' }, '', window.location.href);

    await TestUtils.setupComponentTestBed(CategoryUpdateComponent, [
      { provide: CategoryUpdateService, useValue: mockCategoryUpdateService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
      FormBuilder,
    ]);

    fixture = TestUtils.createFixture(CategoryUpdateComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "debitCategories"', () => {
    expect(component.routerName).toBe('debitCategories');
  });

  it('should initialize formGroup', () => {
    expect(component.formGroup).toBeDefined();
  });

  it('should have inputDescription control', () => {
    const control = component.formGroup.get('inputDescription');
    expect(control).toBeDefined();
  });

  describe.skip('Template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element).toBeTruthy();
    });
  });
});

describe('CategoryUpdateComponent for CREDIT', () => {
  let fixture: ComponentFixture<CategoryUpdateComponent>;
  let component: CategoryUpdateComponent;

  beforeEach(async () => {
    const mockCategoryUpdateService = {
      update: vi.fn().mockReturnValue(of(new Category('Updated Category'))),
      http: vi.fn(),
    };

    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

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

    window.history.replaceState(
      { id: 2, description: 'Credit Category' },
      '',
      window.location.href,
    );

    await TestUtils.setupComponentTestBed(CategoryUpdateComponent, [
      { provide: CategoryUpdateService, useValue: mockCategoryUpdateService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
      FormBuilder,
    ]);

    fixture = TestUtils.createFixture(CategoryUpdateComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "creditCategories"', () => {
    expect(component.routerName).toBe('creditCategories');
  });
});

describe('CategoryUpdateComponent for EQUITY', () => {
  let fixture: ComponentFixture<CategoryUpdateComponent>;
  let component: CategoryUpdateComponent;

  beforeEach(async () => {
    const mockCategoryUpdateService = {
      update: vi.fn().mockReturnValue(of(new Category('Updated Category'))),
      http: vi.fn(),
    };

    const mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

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

    window.history.replaceState(
      { id: 3, description: 'Equity Category' },
      '',
      window.location.href,
    );

    await TestUtils.setupComponentTestBed(CategoryUpdateComponent, [
      { provide: CategoryUpdateService, useValue: mockCategoryUpdateService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
      FormBuilder,
    ]);

    fixture = TestUtils.createFixture(CategoryUpdateComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "equityCategories"', () => {
    expect(component.routerName).toBe('equityCategories');
  });
});
