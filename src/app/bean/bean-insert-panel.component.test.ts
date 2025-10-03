import { BeanInsertPanelComponent } from './bean-insert-panel.component';
import { ComponentFixture } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMessageService } from '../app-message-service';
import { vi } from 'vitest';
import { TestUtils } from '../shared/test-utils';

// Mock Bean and Insert DTO for testing
class MockBean {
  getId() {
    return 'mock-id';
  }
}

interface MockInsertDto {
  name: string;
}
describe('BeanInsertPanelComponent', () => {
  let fixture: ComponentFixture<BeanInsertPanelComponent<MockBean, MockInsertDto>>;
  let component: BeanInsertPanelComponent<MockBean, MockInsertDto>;

  beforeEach(async () => {
    const providers = [
      { provide: Router, useValue: { navigate: vi.fn() } },
      {
        provide: AppMessageService,
        useValue: { addErrorMessage: vi.fn(), addSuccessMessage: vi.fn() },
      },
    ];

    await TestUtils.setupComponentTestBed(BeanInsertPanelComponent, providers);
    fixture = TestUtils.createFixture(BeanInsertPanelComponent) as ComponentFixture<
      BeanInsertPanelComponent<MockBean, MockInsertDto>
    >;
    component = fixture.componentInstance;

    // Set required inputs
    component.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
    });
    component.beanInsertService = { insert: () => of(new MockBean()) };
    component.createBean = () => ({ name: 'test' });
    component.beanName = 'Bean';
    component.routerName = 'bean';

    fixture.detectChanges();
  });

  it('should create', () => {
    const expectedDefaults = {
      beanName: 'Bean',
      routerName: 'bean',
    };
    TestUtils.testBasicInitialization(component, expectedDefaults, BeanInsertPanelComponent);
  });

  it('should render panel header as "New"', () => {
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('p-panel .p-panel-title');
    expect(header?.textContent).toContain('New');
  });

  it('should accept basic input properties', () => {
    const testProperties = [
      {
        key: 'beanName' as keyof BeanInsertPanelComponent<MockBean, MockInsertDto>,
        testValue: 'TestBean',
      },
      {
        key: 'routerName' as keyof BeanInsertPanelComponent<MockBean, MockInsertDto>,
        testValue: 'test-route',
      },
    ];
    TestUtils.testBasicInputProperties(component, fixture, testProperties);
  });

  it('should disable insert button when form is invalid', () => {
    component.formGroup = new FormGroup({
      name: new FormControl('', Validators.required), // empty, so invalid
    });
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[data-pc-name="button"]');
    expect(button?.disabled).toBe(true);
  });

  it('should call beanInsertService.insert when insert is clicked and form is valid', () => {
    const mockService = { insert: vi.fn(() => of(new MockBean())) };
    component.beanInsertService = mockService;
    component.formGroup.patchValue({ name: 'test' }); // make form valid
    fixture.detectChanges();
    component.insert();
    expect(mockService.insert).toHaveBeenCalledWith({ name: 'test' });
  });

  it('should navigate to detail after successful insert', () => {
    const mockRouter = { navigate: vi.fn() };
    (component as unknown as { router: typeof mockRouter }).router = mockRouter;
    component.formGroup.patchValue({ name: 'test' }); // make form valid
    fixture.detectChanges();
    component.insert();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['bean/detail'], {
      state: { bean: expect.any(MockBean) },
    });
  });

  it('should show error message on insert failure', () => {
    const mockMessageService = { addErrorMessage: vi.fn() };
    (component as unknown as { appMessageService: typeof mockMessageService }).appMessageService =
      mockMessageService;
    component.beanInsertService = { insert: () => throwError(() => new Error('fail')) };
    component.formGroup.patchValue({ name: 'test' }); // make form valid
    fixture.detectChanges();
    component.insert(); // This will trigger the catchError in the observable chain
    expect(mockMessageService.addErrorMessage).toHaveBeenCalled();
  });

  it('should navigate to list when cancelInsert is called', () => {
    const mockRouter = { navigate: vi.fn() };
    (component as unknown as { router: typeof mockRouter }).router = mockRouter;
    fixture.detectChanges();
    component.cancelInsert();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['bean']);
  });

  it('should have required methods', () => {
    const expectedMethods = ['insert', 'cancelInsert'];
    TestUtils.testServiceMethods(component, expectedMethods);
  });

  it('should have correct component structure', () => {
    TestUtils.testServiceStructure(component, BeanInsertPanelComponent);
  });

  it('should have correct method signatures', () => {
    const methodSignatures = [
      { methodName: 'insert', parameterCount: 0 },
      { methodName: 'cancelInsert', parameterCount: 0 },
    ];
    TestUtils.testServiceMethodSignatures(component, methodSignatures);
  });

  it('should handle state management correctly', () => {
    const testFormGroup1 = new FormGroup({
      name: new FormControl('value1', Validators.required),
    });
    const testFormGroup2 = new FormGroup({
      name: new FormControl('value2', Validators.required),
    });

    // Test formGroup state changes
    expect(component.formGroup).toBeDefined();

    component.formGroup = testFormGroup1;
    expect(component.formGroup).toBe(testFormGroup1);

    component.formGroup = testFormGroup2;
    expect(component.formGroup).toBe(testFormGroup2);
  });
});
