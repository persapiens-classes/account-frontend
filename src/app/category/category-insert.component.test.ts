import { ComponentFixture } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { CategoryInsertComponent } from './category-insert.component';
import { CategoryInsertService } from './category-insert-service';
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

function createTestBed(type: CategoryType) {
  const mockCategoryInsertService = {
    insert: vi.fn().mockReturnValue(of(new Category('Test Category'))),
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

  return TestUtils.setupComponentTestBed(CategoryInsertComponent, [
    { provide: CategoryInsertService, useValue: mockCategoryInsertService },
    { provide: Router, useValue: mockRouter },
    { provide: AppMessageService, useValue: mockAppMessageService },
    { provide: ActivatedRoute, useValue: activatedRoute },
    { provide: HttpClient, useValue: mockHttpClient },
    FormBuilder,
  ]);
}

function describeInsertComponentTests(type: CategoryType) {
  const typeName = typeNameMap[type];
  const expectedRouterName = routerNameMap[type];

  describe(`CategoryInsertComponent for ${typeName}`, () => {
    let fixture: ComponentFixture<CategoryInsertComponent>;
    let component: CategoryInsertComponent;

    beforeEach(async () => {
      await createTestBed(type);
      fixture = TestUtils.createFixture(CategoryInsertComponent);
      component = fixture.componentInstance;
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it(`should set routerName to "${expectedRouterName}"`, () => {
      expect(component.routerName).toBe(expectedRouterName);
    });

    it('should set beanInsertService to CategoryInsertService', () => {
      expect(component.beanInsertService).toBeDefined();
    });

    if (type === CategoryType.DEBIT) {
      it('should initialize formGroup', () => {
        expect(component.formGroup).toBeDefined();
      });

      it('should have inputDescription control', () => {
        const control = component.formGroup.get('inputDescription');
        expect(control).toBeDefined();
      });

      it('should initialize inputDescription as empty string', () => {
        const value = component.formGroup.get('inputDescription')?.value;
        expect(value).toBe('');
      });

      it('should have required validator on inputDescription', () => {
        const control = component.formGroup.get('inputDescription');
        control?.setValue('');
        expect(control?.hasError('required')).toBe(true);
      });

      it('should have minlength validator on inputDescription', () => {
        const control = component.formGroup.get('inputDescription');
        control?.setValue('ab');
        expect(control?.hasError('minlength')).toBe(true);
      });

      it('should be valid when description has at least 3 characters', () => {
        const control = component.formGroup.get('inputDescription');
        control?.setValue('abc');
        expect(control?.valid).toBe(true);
      });

      it('should create bean with description from form', () => {
        component.formGroup.get('inputDescription')?.setValue('Test Category');
        const bean = component.createBean();
        expect(bean.description).toBe('Test Category');
      });

      it('should create bean with empty description when form is empty', () => {
        component.formGroup.get('inputDescription')?.setValue('');
        const bean = component.createBean();
        expect(bean.description).toBe('');
      });

      it('should handle special characters in description', () => {
        component.formGroup.get('inputDescription')?.setValue('Test & Category #1');
        const bean = component.createBean();
        expect(bean.description).toBe('Test & Category #1');
      });

      it('should handle Unicode characters in description', () => {
        component.formGroup.get('inputDescription')?.setValue('Catégorie Tëst 中文');
        const bean = component.createBean();
        expect(bean.description).toBe('Catégorie Tëst 中文');
      });

      it('should handle very long description', () => {
        const longDescription = 'a'.repeat(1000);
        component.formGroup.get('inputDescription')?.setValue(longDescription);
        const bean = component.createBean();
        expect(bean.description).toBe(longDescription);
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

describeInsertComponentTests(CategoryType.DEBIT);
describeInsertComponentTests(CategoryType.CREDIT);
describeInsertComponentTests(CategoryType.EQUITY);
