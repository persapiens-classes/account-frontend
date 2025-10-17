import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoryListComponent } from './category-list.component';
import { TestUtils } from '../shared/test-utils';
import { CategoryType } from './category';
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

function createTestBed(type: CategoryType) {
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

  return TestUtils.setupComponentTestBed(CategoryListComponent, [
    { provide: AppMessageService, useValue: mockAppMessageService },
    { provide: ActivatedRoute, useValue: activatedRoute },
    { provide: HttpClient, useValue: mockHttpClient },
  ]);
}

function describeListComponentTests(type: CategoryType) {
  const typeName = typeNameMap[type];
  const expectedRouterName = routerNameMap[type];

  describe(`CategoryListComponent for ${typeName}`, () => {
    let fixture: ComponentFixture<CategoryListComponent>;
    let component: CategoryListComponent;

    beforeEach(async () => {
      await createTestBed(type);
      fixture = TestUtils.createFixture(CategoryListComponent);
      component = fixture.componentInstance;
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it(`should set routerName to "${expectedRouterName}"`, () => {
      expect(component.routerName).toBe(expectedRouterName);
    });

    it('should initialize beansList signal', () => {
      expect(component.beansList).toBeDefined();
    });

    if (type === CategoryType.DEBIT) {
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
    }
  });
}

describeListComponentTests(CategoryType.DEBIT);
describeListComponentTests(CategoryType.CREDIT);
describeListComponentTests(CategoryType.EQUITY);
