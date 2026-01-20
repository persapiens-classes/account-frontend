import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Owner } from './owner';
import { InputFieldComponent } from '../field/input-field.component';
import { BeanInsertPanelComponent } from '../bean/bean-insert-panel.component';
import { OwnerInsertService } from './owner-insert-service';
import { form, minLength, required, maxLength } from '@angular/forms/signals';

@Component({
  selector: 'app-owner-insert',
  imports: [CommonModule, InputFieldComponent, BeanInsertPanelComponent],
  template: `
    <app-bean-insert-panel
      [form]="form"
      [createBean]="createBean.bind(this)"
      [beanInsertService]="beanInsertService"
      [beanName]="'Owner'"
      [routerName]="'owners'"
    >
      <app-input-field
        label="Name"
        [autoFocus]="true"
        [formField]="form.name"
        dataCy="input-name"
      />
    </app-bean-insert-panel>
  `,
})
export class OwnerInsertComponent {
  form = form(signal(new Owner('')), (f) => {
    required(f.name);
    minLength(f.name, 3);
    maxLength(f.name, 255);
  });

  beanInsertService = inject(OwnerInsertService);

  createBean(): Owner {
    return new Owner(this.form().value().name);
  }
}
