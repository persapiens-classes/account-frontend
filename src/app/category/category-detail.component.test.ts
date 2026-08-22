import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoryDetailComponent } from './category-detail.component';
import { TestUtils } from '../shared/test-utils';
import { CategoryType } from './category';
import { AppMessageService } from '../app-message-service';
import { PATHS } from '../app.paths';

const typeNameMap: Record<CategoryType, string> = {
  [CategoryType.DEBIT]: 'DEBIT',
  [CategoryType.CREDIT]: 'CREDIT',
  [CategoryType.EQUITY]: 'EQUITY',
};

const routerNameMap: Record<CategoryType, string> = {
  [CategoryType.DEBIT]: `debit${PATHS.CATEGORY_PATH}`,
  [CategoryType.CREDIT]: `credit${PATHS.CATEGORY_PATH}`,
  [CategoryType.EQUITY]: `equity${PATHS.CATEGORY_PATH}`,
};

function createTestBed(type: CategoryType, testId: number) {
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
    request: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  // Mock history.state with a category model
  window.history.replaceState(
    // eslint-disable-next-line security/detect-object-injection
    { model: { id: testId, description: `Test ${typeNameMap[type]} Category` } },
    '',
    window.location.href,
  );

  return TestUtils.setupComponentTestBed(CategoryDetailComponent, [
    { provide: AppMessageService, useValue: mockAppMessageService },
    { provide: ActivatedRoute, useValue: activatedRoute },
    { provide: HttpClient, useValue: mockHttpClient },
  ]);
}

function describeDetailComponentTests(type: CategoryType, testId: number) {
  // eslint-disable-next-line security/detect-object-injection
  const typeName = typeNameMap[type];
  // eslint-disable-next-line security/detect-object-injection
  const expectedRouterName = routerNameMap[type];

  describe(`CategoryDetailComponent for ${typeName}`, () => {
    let fixture: ComponentFixture<CategoryDetailComponent>;
    let component: CategoryDetailComponent;

    beforeEach(async () => {
      await createTestBed(type, testId);
      fixture = TestUtils.createFixture(CategoryDetailComponent);
      component = fixture.componentInstance;
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it(`should set routerName to "${expectedRouterName}"`, () => {
      expect(component.routerName).toBe(expectedRouterName);
    });

    it('should have model property', () => {
      expect(component.model).toBeDefined();
    });

    if (type === CategoryType.DEBIT) {
      describe('Template rendering', () => {
        it('should render component', () => {
          const element = fixture.nativeElement;
          expect(element).toBeTruthy();
        });
      });
    }
  });
}

describeDetailComponentTests(CategoryType.DEBIT, 1);
describeDetailComponentTests(CategoryType.CREDIT, 2);
describeDetailComponentTests(CategoryType.EQUITY, 3);
