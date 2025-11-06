import { Router } from '@angular/router';
import { Bean } from './bean';
import { catchError, of, tap } from 'rxjs';
import { FieldTree } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { BeanInsertService } from './bean-insert-service';
import { AppMessageService } from '../app-message-service';

@Component({
  selector: 'app-bean-insert-panels',
  imports: [ButtonModule, PanelModule, CommonModule],
  template: `
    <form>
      <p-panel header="New">
        <ng-content></ng-content>

        <p-button
          icon="pi pi-check"
          (onClick)="insert()"
          class="mr-3"
          [disabled]="!form()().valid()"
          pTooltip="Save"
        />
        <p-button icon="pi pi-list" (onClick)="cancelInsert()" pTooltip="Cancel to list" />
      </p-panel>
    </form>
  `,
})
export class BeanInsertPanelsComponent<F, T extends Bean, I> {
  form = input.required<FieldTree<F>>();

  createBean = input.required<() => I>();

  beanInsertService = input.required<BeanInsertService<T, I>>();

  beanName = input.required<string>();

  routerName = input.required<string>();

  private readonly router = inject(Router);
  private readonly appMessageService = inject(AppMessageService);

  insert() {
    if (this.form()().valid()) {
      this.beanInsertService()
        .insert(this.createBean()())
        .pipe(
          catchError((error) => {
            this.appMessageService.addErrorMessage(error, `${this.beanName()} not inserted`);
            return of();
          }),
          tap((bean) => {
            this.appMessageService.addSuccessMessage(
              `${this.beanName()} inserted`,
              `${this.beanName()} ${bean.getId()} inserted ok.`,
            );
            this.router.navigate([`${this.routerName()}/detail`], {
              state: { bean: bean },
            });
          }),
        )
        .subscribe();
    }
  }

  cancelInsert() {
    this.router.navigate([`${this.routerName()}`]);
  }
}
