import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { InputFieldSComponent } from '../field/input-fields.component';
import { BeanInsertPanelsComponent } from '../bean/bean-insert-panels.component';
import { OwnerInsertService } from './owner-insert-service';
import { form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-owner-insert',
  imports: [CommonModule, InputFieldSComponent, BeanInsertPanelsComponent],
  template: `
    <app-bean-insert-panels
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="'Owner'"
      [routerName]="'owners'"
    >
      <app-input-fields label="Name" [autoFocus]="true" [field]="form.name" />
    </app-bean-insert-panels>
  `,
})
export class OwnerInsertComponent {
  form = form(signal(new Owner('')), (f) => {
    required(f.name);
    minLength(f.name, 3);
  });

  beanInsertService = inject(OwnerInsertService);

  createBean(): Owner {
    return new Owner(this.form().value().name);
  }
}
