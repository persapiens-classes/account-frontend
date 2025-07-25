import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
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
    FormsModule,
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
        [disabled]="isDisabled"
        [(ngModel)]="value"
        (onInput)="onValueChange($event.value)"
        (onBlur)="onTouched()"
      />
      <label [for]="id">{{ label }}</label>
    </p-float-label>
    <div
      *ngIf="ngControl?.invalid && (ngControl?.dirty || ngControl?.touched)"
      class="alert margin-bottom"
    >
      <div *ngIf="ngControl?.errors?.['required']">{{ label }} is required.</div>
      <div *ngIf="ngControl?.errors?.['minlength']">
        {{ label }} must be at least 3 characters long.
      </div>
    </div>
  `,
})
export class NumberFieldComponent implements ControlValueAccessor {
  @Input() id = 'id';
  @Input() name = 'name';
  @Input() label = '';
  @Input() autoFocus = false;
  @Input() mode = 'currency';
  @Input() currency = 'USD';
  @Input() locale = 'en-US';

  value: number | null = null;
  isDisabled = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: number | null): void => {
    // No-op default implementation
  };
  onTouched = () => {
    this.ngControl?.control?.markAsTouched();
  };

  ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: number | null): void {
    this.value = obj;
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: string | number | null): void {
    const parsedValue = typeof value === 'string' ? parseFloat(value) : value;
    this.value = isNaN(parsedValue as number) ? null : parsedValue;
    this.onChange(this.value);
  }
}
