import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Bean } from './bean';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, inject, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BeanUpdateComponent } from './bean-update.component';
import { BeanUpdateFormGroupService } from './bean-update-form-group.service';
import { BeanService } from './bean-service';
import { BeanServiceFactory } from './bean-service-factory';

@Component({
  selector: 'bean-update',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule],
  template: `
    <form *ngIf="form" [formGroup]="form">
      <p-panel header="Edit">
        <ng-container #dynamicComponent></ng-container>
        
        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the category"/>
        <p-button icon="pi pi-list" (onClick)="cancelToList()" [style]="{'margin-right': '10px'}" pTooltip="Cancel to list"/>
        <p-button icon="pi pi-search" (onClick)="cancelToDetail()" pTooltip="Cancel to detail"/>
      </p-panel>
    </form>
  `
})
export class BeanUpdatePanelComponent<T extends Bean, I, U> {
  form: FormGroup
  bean: T

  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef
  beanUpdateComponentType!: Type<BeanUpdateComponent<U>>
  beanUpdateComponentInstance!: ComponentRef<BeanUpdateComponent<U>>

  beanService: BeanService<T, I, U>

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private messageService: MessageService,
    beanServiceFactory: BeanServiceFactory<T, I, U>
  ) {
    const formGroupServiceType = route.snapshot.data['beanUpdateFormGroupService'] as Type<BeanUpdateFormGroupService<T>>;
    const beanUpdateFormGroupService = inject(formGroupServiceType)
    this.bean = beanUpdateFormGroupService.createBeanFromHistory()
    this.form = beanUpdateFormGroupService.createForm(this.bean)

    this.beanUpdateComponentType = route.snapshot.data['beanUpdateComponent']

    this.beanService = beanServiceFactory.getBeanService(route.snapshot.data['serviceName'])
  }

  ngAfterViewInit() {
    this.container.clear()
    this.beanUpdateComponentInstance = this.container.createComponent(this.beanUpdateComponentType)
  }

  update() {
    if (this.form.valid) {
      const updatedBean = this.beanUpdateComponentInstance.instance.createBeanFn(this.form)

      this.beanService.update(this.bean.getId(), updatedBean).pipe(
        tap((bean) => {
          this.messageService.add({
            severity: 'success',
            summary: `${this.beanService.beanName} edited`,
            detail: `${this.beanService.beanName} ${this.bean.getId()} edited ok.`
          })
          this.router.navigate([`${this.beanService.beansName}/detail`], { state: { bean: bean } })
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: `${this.beanService.beanName} not edited`,
            detail: `${this.beanService.beanName} not edited: ${error.error.message}`
          })
          return of()
        })
      ).subscribe()
    }
  }

  cancelToList() {
    this.router.navigate([`${this.beanService.beansName}`])
  }

  cancelToDetail() {
    this.router.navigate([`${this.beanService.beansName}/detail`], { state: { bean: this.bean } })
  }
}
