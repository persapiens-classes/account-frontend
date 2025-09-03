import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Bean } from './bean';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { BeanUpdateService } from './bean-update-service';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-bean-update-panel',
  imports: [ReactiveFormsModule, ButtonModule, PanelModule, CommonModule],
  template: `
    <form *ngIf="formGroup" [formGroup]="formGroup">
      <p-panel header="Edit">
        <ng-content></ng-content>

        <p-button
          icon="pi pi-check"
          (onClick)="update()"
          class="mr-3"
          [disabled]="formGroup.invalid"
          pTooltip="Save the category"
        />
        <p-button
          icon="pi pi-list"
          (onClick)="cancelToList()"
          class="mr-3"
          pTooltip="Cancel to list"
        />
        <p-button icon="pi pi-search" (onClick)="cancelToDetail()" pTooltip="Cancel to detail" />
      </p-panel>
    </form>
  `,
})
export class BeanUpdatePanelComponent<T extends Bean, U> {
  @Input()
  formGroup!: FormGroup;

  @Input()
  beanFromHistory!: T;

  @Input()
  createBean!: () => U;

  @Input()
  beanUpdateService!: BeanUpdateService<T, U>;

  @Input()
  beanName!: string;
  @Input()
  routerName!: string;

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  update() {
    if (this.formGroup.valid) {
      this.beanUpdateService
        .update(this.beanFromHistory.getId(), this.createBean())
        .pipe(
          tap((bean) => {
            this.appMessageService.addSuccessMessage(
              `${this.beanName} edited`,
              `${this.beanName} ${this.beanFromHistory.getId()} edited ok.`,
            );
            this.router.navigate([`${this.routerName}/detail`], {
              state: { bean: bean },
            });
          }),
          catchError((error) => {
            this.appMessageService.addErrorMessage(error, `${this.beanName} not edited`);
            return of();
          }),
        )
        .subscribe();
    }
  }

  cancelToList() {
    this.router.navigate([`${this.routerName}`]);
  }

  cancelToDetail() {
    this.router.navigate([`${this.routerName}/detail`], {
      state: { bean: this.beanFromHistory },
    });
  }
}
