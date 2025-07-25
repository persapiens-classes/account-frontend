import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-date-field',
  imports: [
    CommonModule,
    FloatLabelModule,
    DatePickerModule,
    AutoFocusModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  template: `
    <p-float-label variant="in" class="margin-bottom">
      <p-date-picker
        [id]="id"
        [name]="name"
        [pAutoFocus]="autoFocus"
        [showIcon]="showIcon"
        [disabled]="isDisabled"
        [(ngModel)]="value"
        (onSelect)="onDateSelect($event)"
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
export class DateFieldComponent implements ControlValueAccessor {
  @Input() id = 'id';
  @Input() name = 'name';
  @Input() label = '';
  @Input() autoFocus = false;
  @Input() showIcon = true;

  value: Date | null = null;
  isDisabled = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: Date | null): void => {
    // No-op default implementation
  };
  onTouched!: () => void;

  ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: Date | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  onDateSelect(value: Date): void {
    this.value = value;
    this.onChange(value);
  }
}
