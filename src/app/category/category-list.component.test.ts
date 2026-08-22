import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { CategoryListComponent } from './category-list.component';
import { TestUtils } from '../shared/test-utils';
import { CategoryType } from './category';
import { categoryRouterNameMap, categoryTypeNameMap } from './category-test-helpers';
import { AppMessageService } from '../app-message-service';

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
    request: vi.fn(() => of([])),
    get: vi.fn(() => of([])),
    post: vi.fn(() => of({})),
    put: vi.fn(() => of({})),
    delete: vi.fn(() => of({})),
  };

  return TestUtils.setupComponentTestBed(CategoryListComponent, [
    { provide: AppMessageService, useValue: mockAppMessageService },
    { provide: ActivatedRoute, useValue: activatedRoute },
    { provide: HttpClient, useValue: mockHttpClient },
  ]);
}

function describeListComponentTests(type: CategoryType) {
  // eslint-disable-next-line security/detect-object-injection
  const typeName = categoryTypeNameMap[type];
  // eslint-disable-next-line security/detect-object-injection
  const expectedRouterName = categoryRouterNameMap[type];

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

    it('should initialize modelsList signal', () => {
      expect(component.modelsList).toBeDefined();
    });

    if (type === CategoryType.DEBIT) {
      it('should set modelRemoveService', () => {
        expect(component.modelRemoveService).toBeDefined();
      });

      describe('Template rendering', () => {
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
