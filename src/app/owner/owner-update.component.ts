import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { createOwner, Owner } from './owner';
import { InputFieldComponent } from '../field/input-field.component';
import { BeanUpdatePanelComponent } from '../bean/bean-update-panel.component';
import { OwnerUpdateService } from './owner-update-service';
import { toBeanFromHistory } from '../bean/bean';
import { form, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-owner-update',
  imports: [ButtonModule, PanelModule, CommonModule, InputFieldComponent, BeanUpdatePanelComponent],
  template: `
    <app-bean-update-panel
      [form]="form"
      [beanFromHistory]="beanFromHistory"
      [createBean]="createBean.bind(this)"
      [beanUpdateService]="beanUpdateService"
      [beanName]="'Owner'"
      [routerName]="'owners'"
    >
      <app-input-fields label="Name" [autoFocus]="true" [field]="form.name" />
    </app-bean-update-panel>
  `,
})
export class OwnerUpdateComponent {
  form = form(signal(toBeanFromHistory(createOwner)), (f) => {
    required(f.name);
    minLength(f.name, 3);
  });

  beanUpdateService = inject(OwnerUpdateService);

  beanFromHistory = toBeanFromHistory(createOwner);

  createBean(): Owner {
    return new Owner(this.form().value().name);
  }
}
