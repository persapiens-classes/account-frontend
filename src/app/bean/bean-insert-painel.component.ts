import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Bean } from './bean';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { BeanInsertComponent } from './bean-insert.component';
import { BeanFormGroupServiceFactory } from './bean-form-group-factory.service';

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
export class BeanInsertPainelComponent<T extends Bean, I, U> {
  form: FormGroup

  @ViewChild('dynamicComponent', { read: ViewContainerRef }) 
  container!: ViewContainerRef
  beanInsertComponent!: Type<BeanInsertComponent<T, I, U>>
  beanInsertInstance!: ComponentRef<BeanInsertComponent<T, I, U>>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    beanFormGroupServiceFactory: BeanFormGroupServiceFactory) {
      this.form = beanFormGroupServiceFactory.getBeanFormGroupService(
        this.route.snapshot.data['beanFormGroupService']).getForm()
      this.form.reset()
  }

  ngOnInit() {
    this.beanInsertComponent = this.route.snapshot.data['beanInsertComponent']
    console.log(this.beanInsertComponent)
  }

  ngAfterViewInit() {
    this.container.clear()
    this.beanInsertInstance = this.container.createComponent(this.beanInsertComponent)
    console.log(this.beanInsertInstance)
  }

  insert() {
    if (this.form.valid) {
      const newBean = this.beanInsertInstance.instance.createBean()

      this.beanInsertInstance.instance.beanService.insert(newBean).pipe(
        tap((bean) => {
          this.messageService.add({
            severity: 'success',
            summary: `${this.beanInsertInstance.instance.beanService.beanName} inserted`,
            detail: `${this.beanInsertInstance.instance.beanService.beanName} ${bean.getId()} inserted ok.`
          })
          this.router.navigate([`${this.beanInsertInstance.instance.beanService.beansName}`])
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: `${this.beanInsertInstance.instance.beanService.beanName} not inserted`,
            detail: `${this.beanInsertInstance.instance.beanService.beanName} not inserted: ${error.error.error}`
          })
          return of()
        })
      ).subscribe()
    }
  }

  cancelInsert() {
    this.router.navigate([`${this.beanInsertInstance.instance.beanService.beansName}`])
  }
}
