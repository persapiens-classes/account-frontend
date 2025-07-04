import { ActivatedRoute, Router } from '@angular/router';
import { Bean } from './bean';
import { catchError, of, tap } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { BeanInsertComponent } from './bean-insert.component';
import { BeanInsertFormGroupService } from './bean-insert-form-group.service';
import { BeanInsertService } from './bean-insert-service';
import { AppMessageService } from '../app-message-service';
import { BeanInsertServiceFactory } from './bean-insert-service-factory';

@Component({
  selector: 'app-bean-insert',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule],
  template: `
    <form *ngIf="form" [formGroup]="form">
      <p-panel header="New">
        <ng-container #dynamicComponent></ng-container>

        <p-button
          icon="pi pi-check"
          (onClick)="insert()"
          [style]="{ 'margin-right': '10px' }"
          [disabled]="form.invalid"
          pTooltip="Save"
        />
        <p-button icon="pi pi-list" (onClick)="cancelInsert()" pTooltip="Cancel to list" />
      </p-panel>
    </form>
  `,
})
export class BeanInsertPanelComponent<T extends Bean, I> implements AfterViewInit {
  form: FormGroup;

  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef;
  beanInsertComponentType!: Type<BeanInsertComponent<I>>;
  beanInsertComponentInstance!: ComponentRef<BeanInsertComponent<I>>;

  beanInsertService: BeanInsertService<T, I>;

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  constructor() {
    const route = inject(ActivatedRoute);
    const formGroupServiceType = route.snapshot.data[
      'beanInsertFormGroupService'
    ] as Type<BeanInsertFormGroupService>;
    this.form = inject(formGroupServiceType).createForm();

    this.beanInsertComponentType = route.snapshot.data['beanInsertComponent'];

    this.beanInsertService = inject(BeanInsertServiceFactory<T, I>).getBeanInsertService(
      route.snapshot.data['serviceName'],
    );
  }

  ngAfterViewInit() {
    this.container.clear();
    this.beanInsertComponentInstance = this.container.createComponent(this.beanInsertComponentType);
  }

  insert() {
    if (this.form.valid) {
      const newBean = this.beanInsertComponentInstance.instance.createBeanFn(this.form);

      this.beanInsertService
        .insert(newBean)
        .pipe(
          tap((bean) => {
            this.appMessageService.addSuccessMessage(
              `${this.beanInsertService.beanName} inserted`,
              `${this.beanInsertService.beanName} ${bean.getId()} inserted ok.`,
            );
            this.router.navigate([`${this.beanInsertService.beansName}/detail`], {
              state: { bean: bean },
            });
          }),
          catchError((error) => {
            this.appMessageService.addErrorMessage(
              error,
              `${this.beanInsertService.beanName} not inserted`,
            );
            return of();
          }),
        )
        .subscribe();
    }
  }

  cancelInsert() {
    this.router.navigate([`${this.beanInsertService.beansName}`]);
  }
}
