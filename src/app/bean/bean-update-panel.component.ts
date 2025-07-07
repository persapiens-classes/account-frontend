import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Bean } from './bean';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  inject,
  Type,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { BeanUpdateComponent } from './bean-update.component';
import { BeanUpdateFormGroupService } from './bean-update-form-group.service';
import { BeanUpdateService } from './bean-update-service';
import { AppMessageService } from '../app-message-service';
import { BeanUpdateServiceFactory } from './bean-update-service-factory';

@Component({
  selector: 'app-bean-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule],
  template: `
    <form *ngIf="form" [formGroup]="form">
      <p-panel header="Edit">
        <ng-container #dynamicComponent></ng-container>

        <p-button
          icon="pi pi-check"
          (onClick)="update()"
          [style]="{ 'margin-right': '10px' }"
          [disabled]="form.invalid"
          pTooltip="Save the category"
        />
        <p-button
          icon="pi pi-list"
          (onClick)="cancelToList()"
          [style]="{ 'margin-right': '10px' }"
          pTooltip="Cancel to list"
        />
        <p-button icon="pi pi-search" (onClick)="cancelToDetail()" pTooltip="Cancel to detail" />
      </p-panel>
    </form>
  `,
})
export class BeanUpdatePanelComponent<T extends Bean, U> implements AfterViewInit {
  form: FormGroup;
  bean: T;

  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef;
  beanUpdateComponentType!: Type<BeanUpdateComponent<U>>;
  beanUpdateComponentInstance!: ComponentRef<BeanUpdateComponent<U>>;

  beanUpdateService: BeanUpdateService<T, U>;

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  constructor() {
    const route = inject(ActivatedRoute);
    const formGroupServiceType = route.snapshot.data['beanUpdateFormGroupService'] as Type<
      BeanUpdateFormGroupService<T>
    >;
    const beanUpdateFormGroupService = inject(formGroupServiceType);
    this.bean = beanUpdateFormGroupService.getBeanFromHistory();
    this.form = beanUpdateFormGroupService.getForm();

    this.beanUpdateComponentType = route.snapshot.data['beanUpdateComponent'];

    this.beanUpdateService = inject(BeanUpdateServiceFactory<T, U>).getBeanUpdateService(
      route.snapshot.data['serviceName'],
    );
  }

  ngAfterViewInit() {
    this.container.clear();
    this.beanUpdateComponentInstance = this.container.createComponent(this.beanUpdateComponentType);
  }

  update() {
    if (this.form.valid) {
      const updatedBean = this.beanUpdateComponentInstance.instance.createBeanFn(this.form);

      this.beanUpdateService
        .update(this.bean.getId(), updatedBean)
        .pipe(
          tap((bean) => {
            this.appMessageService.addSuccessMessage(
              `${this.beanUpdateService.beanName} edited`,
              `${this.beanUpdateService.beanName} ${this.bean.getId()} edited ok.`,
            );
            this.router.navigate([`${this.beanUpdateService.beansName}/detail`], {
              state: { bean: bean },
            });
          }),
          catchError((error) => {
            this.appMessageService.addErrorMessage(
              error,
              `${this.beanUpdateService.beanName} not edited`,
            );
            return of();
          }),
        )
        .subscribe();
    }
  }

  cancelToList() {
    this.router.navigate([`${this.beanUpdateService.beansName}`]);
  }

  cancelToDetail() {
    this.router.navigate([`${this.beanUpdateService.beansName}/detail`], {
      state: { bean: this.bean },
    });
  }
}
