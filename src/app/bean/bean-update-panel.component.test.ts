import { BeanUpdatePanelComponent } from './bean-update-panel.component';
import { ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMessageService } from '../app-message-service';
import { vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';

// Mock Bean and Update DTO for testing
class MockBean {
  getId() {
    return 'test-123';
  }
}

interface MockUpdateDto {
  name: string;
}

describe('BeanUpdatePanelComponent', () => {
  let fixture: ComponentFixture<BeanUpdatePanelComponent<MockBean, MockUpdateDto>>;
  let component: BeanUpdatePanelComponent<MockBean, MockUpdateDto>;

  beforeEach(async () => {
    const providers = [
      { provide: Router, useValue: { navigate: vi.fn() } },
      {
        provide: AppMessageService,
        useValue: { addErrorMessage: vi.fn(), addSuccessMessage: vi.fn() },
      },
    ];

    await TestUtils.setupComponentTestBed(BeanUpdatePanelComponent, providers);
    fixture = TestUtils.createFixture(BeanUpdatePanelComponent) as ComponentFixture<
      BeanUpdatePanelComponent<MockBean, MockUpdateDto>
    >;
    component = fixture.componentInstance;

    // Set required inputs
    component.formGroup = new FormGroup({
      name: new FormControl('test', Validators.required),
    });
    component.beanFromHistory = new MockBean();
    component.beanUpdateService = { update: () => of(new MockBean()) };
    component.createBean = () => ({ name: component.formGroup.get('name')?.value || 'test' });
    component.beanName = 'Bean';
    component.routerName = 'bean';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render panel header as "Edit"', () => {
    const panelHeader = fixture.nativeElement.querySelector('p-panel');
    expect(panelHeader).toBeTruthy();
    expect(panelHeader.getAttribute('header')).toBe('Edit');
  });

  it('should accept basic input properties', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.beanFromHistory).toBeDefined();
    expect(component.beanUpdateService).toBeDefined();
    expect(component.createBean).toBeDefined();
    expect(component.beanName).toBe('Bean');
    expect(component.routerName).toBe('bean');
  });

  it('should disable update button when form is invalid', () => {
    component.formGroup.get('name')?.setValue('');
    fixture.detectChanges();
    const updateButton = fixture.nativeElement.querySelector('button[data-pc-name="button"]');
    expect(updateButton?.disabled).toBe(true);
  });

  it('should show correct button tooltip as "Save the category"', () => {
    fixture.detectChanges();
    const updateButton = fixture.nativeElement.querySelector(
      'p-button[pTooltip="Save the category"]',
    );
    expect(updateButton).not.toBeNull();
    expect(updateButton.getAttribute('pTooltip')).toBe('Save the category');
  });

  it('should call beanUpdateService.update when update is clicked and form is valid', () => {
    const mockService = { update: vi.fn().mockReturnValue(of(new MockBean())) };
    component.beanUpdateService = mockService;
    component.formGroup.get('name')?.setValue('updated-test');

    component.update();

    expect(mockService.update).toHaveBeenCalledWith('test-123', { name: 'updated-test' });
  });

  it('should navigate to detail after successful update', () => {
    const mockRouter = { navigate: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).router = mockRouter;
    const mockService = { update: vi.fn().mockReturnValue(of(new MockBean())) };
    component.beanUpdateService = mockService;

    component.update();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['bean/detail'], {
      state: { bean: expect.any(MockBean) },
    });
  });

  it('should show success message with "edited" text after successful update', () => {
    const mockAppMessageService = { addSuccessMessage: vi.fn(), addErrorMessage: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).appMessageService = mockAppMessageService;
    const mockService = { update: vi.fn().mockReturnValue(of(new MockBean())) };
    component.beanUpdateService = mockService;

    component.update();

    expect(mockAppMessageService.addSuccessMessage).toHaveBeenCalledWith(
      'Bean edited',
      'Bean test-123 edited ok.',
    );
  });

  it('should show error message on update failure', () => {
    const mockAppMessageService = { addSuccessMessage: vi.fn(), addErrorMessage: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).appMessageService = mockAppMessageService;
    const mockService = {
      update: vi.fn().mockReturnValue(throwError(() => new Error('Update failed'))),
    };
    component.beanUpdateService = mockService;

    component.update();

    expect(mockAppMessageService.addErrorMessage).toHaveBeenCalledWith(
      expect.any(Error),
      'Bean not edited',
    );
  });

  it('should navigate to list when cancelToList is called', () => {
    const mockRouter = { navigate: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).router = mockRouter;

    component.cancelToList();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['bean']);
  });

  it('should navigate to detail when cancelToDetail is called', () => {
    const mockRouter = { navigate: vi.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).router = mockRouter;

    component.cancelToDetail();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['bean/detail'], {
      state: { bean: component.beanFromHistory },
    });
  });

  // Test utility-based tests - these verify component structure without detailed assertions
  it('should have required methods', () => {
    TestUtils.testServiceMethodSignatures(component, [
      { methodName: 'update', parameterCount: 0 },
      { methodName: 'cancelToList', parameterCount: 0 },
      { methodName: 'cancelToDetail', parameterCount: 0 },
    ]);
    expect(component.update).toBeDefined();
  });

  it('should have correct component structure', () => {
    TestUtils.testServiceStructure(component, BeanUpdatePanelComponent);
    expect(component.formGroup).toBeDefined();
    expect(component.beanFromHistory).toBeDefined();
    expect(component.beanUpdateService).toBeDefined();
    expect(component.createBean).toBeDefined();
    expect(component.beanName).toBeDefined();
    expect(component.routerName).toBeDefined();
  });

  it('should have correct method signatures', () => {
    expect(typeof component.update).toBe('function');
    expect(typeof component.cancelToList).toBe('function');
    expect(typeof component.cancelToDetail).toBe('function');
  });

  it('should handle state management correctly', () => {
    // Test that component maintains its state properly
    const initialName = component.formGroup.get('name')?.value;
    component.formGroup.get('name')?.setValue('changed');
    expect(component.formGroup.get('name')?.value).toBe('changed');
    expect(component.formGroup.get('name')?.value).not.toBe(initialName);
  });

  it('should handle update service calls with bean ID from history', () => {
    const mockService = { update: vi.fn().mockReturnValue(of(new MockBean())) };
    component.beanUpdateService = mockService;

    // Set form value to match what createBean returns
    component.formGroup.get('name')?.setValue('test');

    component.update();

    expect(mockService.update).toHaveBeenCalledWith(component.beanFromHistory.getId(), {
      name: 'test',
    });
  });
});
