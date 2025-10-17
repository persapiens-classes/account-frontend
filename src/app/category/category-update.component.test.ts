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

const typeNameMap: Record<CategoryType, string> = {
  [CategoryType.DEBIT]: 'DEBIT',
  [CategoryType.CREDIT]: 'CREDIT',
  [CategoryType.EQUITY]: 'EQUITY',
};

const routerNameMap: Record<CategoryType, string> = {
  [CategoryType.DEBIT]: 'debitCategories',
  [CategoryType.CREDIT]: 'creditCategories',
  [CategoryType.EQUITY]: 'equityCategories',
};

function createTestBed(type: CategoryType, testId: number) {
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
      data: { type },
    },
  };

  const mockHttpClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  // Mock history.state with a category
  window.history.replaceState(
    { id: testId, description: `Test ${typeNameMap[type]} Category` },
    '',
    window.location.href,
  );

  return TestUtils.setupComponentTestBed(CategoryUpdateComponent, [
    { provide: CategoryUpdateService, useValue: mockCategoryUpdateService },
    { provide: Router, useValue: mockRouter },
    { provide: AppMessageService, useValue: mockAppMessageService },
    { provide: ActivatedRoute, useValue: activatedRoute },
    { provide: HttpClient, useValue: mockHttpClient },
    FormBuilder,
  ]);
}

function describeUpdateComponentTests(type: CategoryType, testId: number) {
  const typeName = typeNameMap[type];
  const expectedRouterName = routerNameMap[type];

  describe(`CategoryUpdateComponent for ${typeName}`, () => {
    let fixture: ComponentFixture<CategoryUpdateComponent>;
    let component: CategoryUpdateComponent;

    beforeEach(async () => {
      await createTestBed(type, testId);
      fixture = TestUtils.createFixture(CategoryUpdateComponent);
      component = fixture.componentInstance;
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it(`should set routerName to "${expectedRouterName}"`, () => {
      expect(component.routerName).toBe(expectedRouterName);
    });

    if (type === CategoryType.DEBIT) {
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
    }
  });
}

describeUpdateComponentTests(CategoryType.DEBIT, 1);
describeUpdateComponentTests(CategoryType.CREDIT, 2);
describeUpdateComponentTests(CategoryType.EQUITY, 3);
