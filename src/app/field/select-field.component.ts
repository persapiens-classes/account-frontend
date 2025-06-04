import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Bean } from '../bean/bean';

@Component({
  selector: 'a-select-field',
  imports: [CommonModule, FloatLabelModule, SelectModule, ReactiveFormsModule],
  template: `
    <p-float-label variant="in" class="margin-bottom">
      <p-select
        [id]="id"
        [name]="name"
        placeholder="{{ placeholder }}"
        [autofocus]="autoFocus"
        [options]="options"
        optionLabel="{{ optionLabel }}"
        [formControl]="formControl"
      />
      <label [for]="id">{{ label }}</label>
    </p-float-label>
    <div *ngIf="control.invalid && (control.dirty || control.touched)" class="alert margin-bottom">
      <div *ngIf="control?.errors?.['required']">{{ label }} is required.</div>
    </div>
  `,
})
export class SelectFieldComponent {
  @Input() id = 'id';
  @Input() name = 'name';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() autoFocus = false;
  @Input() optionLabel = '';
  @Input() options!: Bean[];
  @Input() control!: AbstractControl;

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
