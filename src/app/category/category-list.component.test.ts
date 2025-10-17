import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoryListComponent } from './category-list.component';
import { TestUtils } from '../shared/test-utils';
import { CategoryType } from './category';
import { AppMessageService } from '../app-message-service';

describe('CategoryListComponent for DEBIT', () => {
  let fixture: ComponentFixture<CategoryListComponent>;
  let component: CategoryListComponent;

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

    await TestUtils.setupComponentTestBed(CategoryListComponent, [
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    fixture = TestUtils.createFixture(CategoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "debitCategories"', () => {
    expect(component.routerName).toBe('debitCategories');
  });

  it('should initialize beansList signal', () => {
    expect(component.beansList).toBeDefined();
  });

  it('should set beanRemoveService', () => {
    expect(component.beanRemoveService).toBeDefined();
  });

  describe.skip('Template rendering', () => {
    it('should render component', () => {
      fixture.detectChanges();
      const element = fixture.nativeElement;
      expect(element).toBeTruthy();
    });
  });
});

describe('CategoryListComponent for CREDIT', () => {
  let fixture: ComponentFixture<CategoryListComponent>;
  let component: CategoryListComponent;

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

    await TestUtils.setupComponentTestBed(CategoryListComponent, [
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    fixture = TestUtils.createFixture(CategoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "creditCategories"', () => {
    expect(component.routerName).toBe('creditCategories');
  });

  it('should initialize beansList signal', () => {
    expect(component.beansList).toBeDefined();
  });
});

describe('CategoryListComponent for EQUITY', () => {
  let fixture: ComponentFixture<CategoryListComponent>;
  let component: CategoryListComponent;

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

    await TestUtils.setupComponentTestBed(CategoryListComponent, [
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: activatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
    ]);

    fixture = TestUtils.createFixture(CategoryListComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set routerName to "equityCategories"', () => {
    expect(component.routerName).toBe('equityCategories');
  });

  it('should initialize beansList signal', () => {
    expect(component.beansList).toBeDefined();
  });
});
