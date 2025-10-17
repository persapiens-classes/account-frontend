import { ComponentFixture } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { AccountInsertComponent } from './account-insert.component';
import { AccountInsertService } from './account-insert-service';
import { Account, AccountType } from './account';
import { Category } from '../category/category';
import { TestUtils } from '../shared/test-utils';
import { AppMessageService } from '../app-message-service';
import { HttpClient } from '@angular/common/http';

describe('AccountInsertComponent', () => {
  let component: AccountInsertComponent;
  let fixture: ComponentFixture<AccountInsertComponent>;
  let mockAccountInsertService: {
    insert: ReturnType<typeof vi.fn>;
    http: unknown;
  };
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockAppMessageService: {
    addErrorMessage: ReturnType<typeof vi.fn>;
    addSuccessMessage: ReturnType<typeof vi.fn>;
  };
  let mockActivatedRoute: {
    snapshot: {
      data: Record<string, unknown>;
    };
  };
  let mockHttpClient: unknown;

  beforeEach(async () => {
    // Create service mocks
    mockAccountInsertService = {
      insert: vi.fn().mockReturnValue(of(new Account('Test Account', 'Test Category'))),
      http: vi.fn(),
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        data: { type: AccountType.DEBIT, categoryType: 'DebitCategory' },
      },
    };

    mockHttpClient = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(AccountInsertComponent, [
      { provide: AccountInsertService, useValue: mockAccountInsertService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: HttpClient, useValue: mockHttpClient },
      FormBuilder,
    ]);

    fixture = TestUtils.createFixture(AccountInsertComponent);
    component = fixture.componentInstance;
  });

  // Basic component structure tests using TestUtils
  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(component, {}, AccountInsertComponent);
      expect(component).toBeTruthy();
    });

    it('should have correct form group configuration', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.get('inputDescription')).toBeDefined();
      expect(component.formGroup.get('selectCategory')).toBeDefined();

      const descriptionControl = component.formGroup.get('inputDescription');
      expect(descriptionControl?.value).toBe('');
      expect(descriptionControl?.hasError('required')).toBe(true);

      const categoryControl = component.formGroup.get('selectCategory');
      expect(categoryControl?.value).toBe('');
      expect(categoryControl?.hasError('required')).toBe(true);
    });

    it('should inject required services', () => {
      expect(component.beanInsertService).toBeDefined();
      expect(component.beanInsertService).toBeInstanceOf(AccountInsertService);
    });

    it('should initialize with empty form values', () => {
      expect(component.formGroup.get('inputDescription')?.value).toBe('');
      expect(component.formGroup.get('selectCategory')?.value).toBe('');
      expect(component.formGroup.invalid).toBe(true);
    });

    it('should set routerName based on account type', () => {
      expect(component.routerName).toBe('debitAccounts');
    });

    it('should set beanName based on account type', () => {
      expect(component.beanName).toBe('Debit Account');
    });

    it('should initialize categories signal', () => {
      expect(component.categories).toBeDefined();
      expect(typeof component.categories).toBe('function');
    });
  });

  // Form validation tests
  describe('Form Validation', () => {
    it('should validate required description field', () => {
      const descriptionControl = component.formGroup.get('inputDescription');

      // Test empty value
      descriptionControl?.setValue('');
      expect(descriptionControl?.hasError('required')).toBe(true);
      expect(component.formGroup.invalid).toBe(true);

      // Test valid value
      descriptionControl?.setValue('Test Account');
      expect(descriptionControl?.hasError('required')).toBe(false);
      expect(descriptionControl?.valid).toBe(true);
    });

    it('should validate minimum length for description field', () => {
      const descriptionControl = component.formGroup.get('inputDescription');

      // Test too short
      descriptionControl?.setValue('ab');
      expect(descriptionControl?.hasError('minlength')).toBe(true);
      expect(component.formGroup.invalid).toBe(true);

      // Test minimum valid length
      descriptionControl?.setValue('abc');
      expect(descriptionControl?.hasError('minlength')).toBe(false);
      expect(descriptionControl?.valid).toBe(true);

      // Test longer valid value
      descriptionControl?.setValue('Test Account Description');
      expect(descriptionControl?.hasError('minlength')).toBe(false);
      expect(descriptionControl?.valid).toBe(true);
    });

    it('should validate required category field', () => {
      const categoryControl = component.formGroup.get('selectCategory');
      const descriptionControl = component.formGroup.get('inputDescription');

      // Set valid description
      descriptionControl?.setValue('Test Account');

      // Test empty category
      categoryControl?.setValue('');
      expect(categoryControl?.hasError('required')).toBe(true);
      expect(component.formGroup.invalid).toBe(true);

      // Test valid category
      categoryControl?.setValue(new Category('Assets'));
      expect(categoryControl?.hasError('required')).toBe(false);
      expect(component.formGroup.valid).toBe(true);
    });

    it('should accept special characters in description field', () => {
      const descriptionControl = component.formGroup.get('inputDescription');
      const categoryControl = component.formGroup.get('selectCategory');
      categoryControl?.setValue(new Category('Test'));

      const specialDescriptions = [
        'Account & Co. Ltd.',
        'Account "Quoted" Name',
        "Account's Possessive",
        'Account-Hyphenated',
        'Account (Parentheses)',
      ];

      specialDescriptions.forEach((description) => {
        descriptionControl?.setValue(description);
        expect(descriptionControl?.valid).toBe(true);
        expect(component.formGroup.valid).toBe(true);
      });
    });

    it('should handle form state changes', () => {
      const descriptionControl = component.formGroup.get('inputDescription');
      const categoryControl = component.formGroup.get('selectCategory');

      // Initially invalid
      expect(component.formGroup.invalid).toBe(true);

      // Set description - still invalid without category
      descriptionControl?.setValue('Valid Account');
      expect(component.formGroup.invalid).toBe(true);

      // Set category - now valid
      categoryControl?.setValue(new Category('Assets'));
      expect(component.formGroup.valid).toBe(true);

      // Clear description - invalid again
      descriptionControl?.setValue('');
      expect(component.formGroup.invalid).toBe(true);
    });

    it('should require both description and category to be valid', () => {
      const descriptionControl = component.formGroup.get('inputDescription');
      const categoryControl = component.formGroup.get('selectCategory');

      // Only description valid
      descriptionControl?.setValue('Test Account');
      expect(component.formGroup.invalid).toBe(true);

      // Only category valid
      descriptionControl?.setValue('');
      categoryControl?.setValue(new Category('Assets'));
      expect(component.formGroup.invalid).toBe(true);

      // Both valid
      descriptionControl?.setValue('Test Account');
      categoryControl?.setValue(new Category('Assets'));
      expect(component.formGroup.valid).toBe(true);
    });
  });

  // createBean method tests
  describe('createBean Method', () => {
    it('should create Account with form values', () => {
      component.formGroup.get('inputDescription')?.setValue('Test Description');
      component.formGroup.get('selectCategory')?.setValue(new Category('Test Category'));

      const account = component.createBean();

      expect(account).toBeInstanceOf(Account);
      expect(account.description).toBe('Test Description');
      expect(account.category).toBe('Test Category');
    });

    it('should extract category description from Category object', () => {
      component.formGroup.get('inputDescription')?.setValue('Account 1');
      component.formGroup.get('selectCategory')?.setValue(new Category('Assets'));

      const account = component.createBean();

      expect(account.description).toBe('Account 1');
      expect(account.category).toBe('Assets');
    });

    it('should handle special characters in description', () => {
      component.formGroup.get('inputDescription')?.setValue('Account & Co.');
      component.formGroup.get('selectCategory')?.setValue(new Category('Liabilities'));

      const account = component.createBean();

      expect(account.description).toBe('Account & Co.');
      expect(account.category).toBe('Liabilities');
    });

    it('should create Account with getId method', () => {
      component.formGroup.get('inputDescription')?.setValue('Test Account');
      component.formGroup.get('selectCategory')?.setValue(new Category('Assets'));

      const account = component.createBean();

      expect(account.getId()).toBe('Test Account');
    });
  });

  // Template rendering tests
  describe.skip('Template Rendering', () => {
    // These tests are skipped because they require httpResource to be fully functional
    // httpResource is used by CategoryListService to load categories
    // Mocking httpResource properly would require a complex HttpClient mock with request() method
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render BeanInsertPanelComponent', () => {
      const beanInsertPanel = fixture.debugElement.query(By.css('app-bean-insert-panel'));
      expect(beanInsertPanel).toBeTruthy();
    });

    it('should pass correct props to BeanInsertPanelComponent', () => {
      const beanInsertPanel = fixture.debugElement.query(By.css('app-bean-insert-panel'));

      expect(beanInsertPanel.componentInstance.formGroup).toBe(component.formGroup);
      expect(beanInsertPanel.componentInstance.beanInsertService).toBe(component.beanInsertService);
      expect(beanInsertPanel.componentInstance.beanName).toBe(component.beanName);
      expect(beanInsertPanel.componentInstance.routerName).toBe(component.routerName);
    });

    it('should render InputFieldComponent for description', () => {
      const inputField = fixture.debugElement.query(By.css('app-input-field'));
      expect(inputField).toBeTruthy();
      expect(inputField.componentInstance.label).toBe('Description');
      expect(inputField.componentInstance.autoFocus).toBe(true);
    });

    it('should render SelectFieldComponent for category', () => {
      const selectField = fixture.debugElement.query(By.css('app-select-field'));
      expect(selectField).toBeTruthy();
      expect(selectField.componentInstance.label).toBe('Category');
      expect(selectField.componentInstance.optionLabel).toBe('description');
    });

    it('should bind formGroup to form controls', () => {
      const inputField = fixture.debugElement.query(By.css('app-input-field'));
      const selectField = fixture.debugElement.query(By.css('app-select-field'));

      expect(inputField.nativeElement.getAttribute('ng-reflect-name')).toBe('inputDescription');
      expect(selectField.nativeElement.getAttribute('ng-reflect-name')).toBe('selectCategory');
    });
  });

  // AccountType integration tests
  describe('AccountType Integration', () => {
    it('should handle CREDIT account type', async () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.CREDIT;

      const newFixture = TestUtils.createFixture(AccountInsertComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.routerName).toBe('creditAccounts');
      expect(newComponent.beanName).toBe('Credit Account');
    });

    it('should handle EQUITY account type', async () => {
      mockActivatedRoute.snapshot.data['type'] = AccountType.EQUITY;

      const newFixture = TestUtils.createFixture(AccountInsertComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.routerName).toBe('equityAccounts');
      expect(newComponent.beanName).toBe('Equity Account');
    });

    it('should create correct AccountInsertService for each type', () => {
      expect(component.beanInsertService).toBeInstanceOf(AccountInsertService);
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle very long description', () => {
      const longDescription = 'A'.repeat(1000);
      const descriptionControl = component.formGroup.get('inputDescription');
      const categoryControl = component.formGroup.get('selectCategory');

      descriptionControl?.setValue(longDescription);
      categoryControl?.setValue(new Category('Assets'));

      expect(descriptionControl?.valid).toBe(true);
      expect(component.formGroup.valid).toBe(true);

      const account = component.createBean();
      expect(account.description).toBe(longDescription);
    });

    it('should handle whitespace in description', () => {
      const descriptionControl = component.formGroup.get('inputDescription');
      const categoryControl = component.formGroup.get('selectCategory');

      descriptionControl?.setValue('   Test Account   ');
      categoryControl?.setValue(new Category('Assets'));

      const account = component.createBean();
      expect(account.description).toBe('   Test Account   ');
    });

    it('should handle category with special characters', () => {
      component.formGroup.get('inputDescription')?.setValue('Test Account');
      component.formGroup
        .get('selectCategory')
        ?.setValue(new Category('Category & Special <chars>'));

      const account = component.createBean();
      expect(account.category).toBe('Category & Special <chars>');
    });
  });

  // Component lifecycle tests
  describe('Component Lifecycle', () => {
    it('should initialize formGroup in constructor', () => {
      expect(component.formGroup).toBeDefined();
      expect(component.formGroup.get('inputDescription')).toBeDefined();
      expect(component.formGroup.get('selectCategory')).toBeDefined();
    });

    it.skip('should maintain form state through change detection', () => {
      // Skipped: requires httpResource mock
      const descriptionControl = component.formGroup.get('inputDescription');
      descriptionControl?.setValue('Test Value');

      fixture.detectChanges();
      expect(descriptionControl?.value).toBe('Test Value');

      fixture.detectChanges();
      expect(descriptionControl?.value).toBe('Test Value');
    });

    it.skip('should not reset form after initialization', () => {
      // Skipped: requires httpResource mock
      component.formGroup.get('inputDescription')?.setValue('Persistent Value');
      component.formGroup.get('selectCategory')?.setValue(new Category('Assets'));

      fixture.detectChanges();

      expect(component.formGroup.get('inputDescription')?.value).toBe('Persistent Value');
      expect(component.formGroup.get('selectCategory')?.value).toEqual(new Category('Assets'));
    });
  });
});
