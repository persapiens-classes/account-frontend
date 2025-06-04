import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-number-field',
  imports: [
    CommonModule,
    FloatLabelModule,
    InputNumberModule,
    AutoFocusModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  template: `
    <p-float-label variant="in" class="margin-bottom">
      <p-inputnumber
        [id]="id"
        [name]="name"
        [mode]="mode"
        [currency]="currency"
        [locale]="locale"
        [pAutoFocus]="autoFocus"
        [formControl]="formControl"
      />
      <label [for]="id">{{ label }}</label>
    </p-float-label>
    <div *ngIf="control.invalid && (control.dirty || control.touched)" class="alert margin-bottom">
      <div *ngIf="control?.errors?.['required']">{{ label }} is required.</div>
      <div *ngIf="control?.errors?.['minlength']">
        {{ label }} must be at least 3 characters long.
      </div>
    </div>
  `,
})
export class NumberFieldComponent {
  @Input() id = 'id';
  @Input() name = 'name';
  @Input() label = '';
  @Input() autoFocus = false;
  @Input() mode = 'currency';
  @Input() currency = 'USD';
  @Input() locale = 'en-US';
  @Input() control!: AbstractControl;

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
