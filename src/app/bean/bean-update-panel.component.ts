import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Bean } from './bean';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BeanUpdateComponent } from './bean-update.component';
import { BeanUpdateFormGroupServiceFactory } from './bean-update-form-group-factory.service';
import { BeanUpdateFormGroupService } from './bean-update-form-group.service';

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
  beanUpdateComponentType!: Type<BeanUpdateComponent<T, I, U>>
  beanUpdateComponentInstance!: ComponentRef<BeanUpdateComponent<T, I, U>>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    beanFormGroupServiceFactory: BeanUpdateFormGroupServiceFactory) {

    let beanFormGroupService: BeanUpdateFormGroupService<T> = beanFormGroupServiceFactory.getBeanUpdateFormGroupService(
      this.route.snapshot.data['beanUpdateFormGroupService'])
    this.bean = beanFormGroupService.createBeanFromHistory()
    this.form = beanFormGroupService.createForm(this.bean)
  }

  ngOnInit() {
    this.beanUpdateComponentType = this.route.snapshot.data['beanUpdateComponent']
  }

  ngAfterViewInit() {
    this.container.clear()
    this.beanUpdateComponentInstance = this.container.createComponent(this.beanUpdateComponentType)
  }

  update() {
    if (this.form.valid) {
      const updatedBean = this.beanUpdateComponentInstance.instance.createBean()

      this.beanUpdateComponentInstance.instance.beanService.update(this.bean.getId(), updatedBean).pipe(
        tap((bean) => {
          this.messageService.add({
            severity: 'success',
            summary: `${this.beanUpdateComponentInstance.instance.beanService.beanName} edited`,
            detail: `${this.beanUpdateComponentInstance.instance.beanService.beanName} ${this.bean.getId()} edited ok.`
          })
          this.router.navigate([`${this.beanUpdateComponentInstance.instance.beanService.beansName}/detail`], { state: { bean: bean } })
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: `${this.beanUpdateComponentInstance.instance.beanService.beanName} not edited`,
            detail: `${this.beanUpdateComponentInstance.instance.beanService.beanName} not edited: ${error.error.error}`
          })
          return of()
        })
      ).subscribe()
    }
  }

  cancelToList() {
    this.router.navigate([`${this.beanUpdateComponentInstance.instance.beanService.beansName}`])
  }

  cancelToDetail() {
    this.router.navigate([`${this.beanUpdateComponentInstance.instance.beanService.beansName}/detail`], { state: { bean: this.bean } })
  }
}
