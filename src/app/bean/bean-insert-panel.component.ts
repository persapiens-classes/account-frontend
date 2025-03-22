import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Bean } from './bean';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, inject, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BeanInsertComponent } from './bean-insert.component';
import { BeanInsertFormGroupService } from './bean-insert-form-group.service';

@Component({
  selector: 'bean-insert',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule],
  template: `
    <form *ngIf="form" [formGroup]="form">
      <p-panel header="New">
        <ng-container #dynamicComponent></ng-container>
        
        <p-button icon="pi pi-check" (onClick)="insert()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save"/>
        <p-button icon="pi pi-list" (onClick)="cancelInsert()" pTooltip="Cancel to list"/>
      </p-panel>
    </form>
  `
})
export class BeanInsertPanelComponent<T extends Bean, I, U> {
  form: FormGroup

  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef
  beanInsertComponentType!: Type<BeanInsertComponent<T, I, U>>
  beanInsertComponentInstance!: ComponentRef<BeanInsertComponent<T, I, U>>

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private messageService: MessageService
  ) {
    const formGroupServiceType = route.snapshot.data['beanInsertFormGroupService'] as Type<BeanInsertFormGroupService<T>>;
    this.form = inject(formGroupServiceType).createForm()

    this.beanInsertComponentType = route.snapshot.data['beanInsertComponent']
  }

  ngAfterViewInit() {
    this.container.clear()
    this.beanInsertComponentInstance = this.container.createComponent(this.beanInsertComponentType)
  }

  insert() {
    if (this.form.valid) {
      const newBean = this.beanInsertComponentInstance.instance.createBeanFn(this.form)

      this.beanInsertComponentInstance.instance.beanService.insert(newBean).pipe(
        tap((bean) => {
          this.messageService.add({
            severity: 'success',
            summary: `${this.beanInsertComponentInstance.instance.beanService.beanName} inserted`,
            detail: `${this.beanInsertComponentInstance.instance.beanService.beanName} ${bean.getId()} inserted ok.`
          })
          this.router.navigate([`${this.beanInsertComponentInstance.instance.beanService.beansName}`])
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: `${this.beanInsertComponentInstance.instance.beanService.beanName} not inserted`,
            detail: `${this.beanInsertComponentInstance.instance.beanService.beanName} not inserted: ${error.error.error}`
          })
          return of()
        })
      ).subscribe()
    }
  }

  cancelInsert() {
    this.router.navigate([`${this.beanInsertComponentInstance.instance.beanService.beansName}`])
  }
}
