import { Router } from '@angular/router';
import { Bean } from './bean';
import { catchError, of, tap } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { BeanInsertService } from './bean-insert-service';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-bean-insert-panel',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule],
  template: `
    <form *ngIf="formGroup" [formGroup]="formGroup">
      <p-panel header="New">
        <ng-content></ng-content>

        <p-button
          icon="pi pi-check"
          (onClick)="insert()"
          [style]="{ 'margin-right': '10px' }"
          [disabled]="formGroup.invalid"
          pTooltip="Save"
        />
        <p-button icon="pi pi-list" (onClick)="cancelInsert()" pTooltip="Cancel to list" />
      </p-panel>
    </form>
  `,
})
export class BeanInsertPanelComponent<T extends Bean, I> {
  @Input()
  formGroup!: FormGroup;

  @Input()
  createBean!: () => I;

  @Input()
  beanInsertService!: BeanInsertService<T, I>;

  @Input()
  beanName!: string;

  @Input()
  routerName!: string;

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  insert() {
    if (this.formGroup.valid) {
      this.beanInsertService
        .insert(this.createBean())
        .pipe(
          catchError((error) => {
            this.appMessageService.addErrorMessage(error, `${this.beanName} not inserted`);
            return of();
          }),
          tap((bean) => {
            this.appMessageService.addSuccessMessage(
              `${this.beanName} inserted`,
              `${this.beanName} ${bean.getId()} inserted ok.`,
            );
            this.router.navigate([`${this.routerName}/detail`], {
              state: { bean: bean },
            });
          }),
        )
        .subscribe();
    }
  }

  cancelInsert() {
    this.router.navigate([`${this.routerName}`]);
  }
}
