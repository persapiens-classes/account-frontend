import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ControlValueAccessor, NgControl, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Bean } from '../bean/bean';

@Component({
  selector: 'app-select-field',
  imports: [CommonModule, FloatLabelModule, SelectModule, FormsModule],
  template: `
    <p-float-label variant="in" class="margin-bottom">
      <p-select
        [id]="id"
        [name]="name"
        placeholder="{{ placeholder }}"
        [autofocus]="autoFocus"
        [options]="options"
        optionLabel="{{ optionLabel }}"
        [disabled]="isDisabled"
        [(ngModel)]="value"
        (onChange)="onSelect($event.value)"
        (onBlur)="onTouched()"
      />
      <label [for]="id">{{ label }}</label>
    </p-float-label>
    <div
      *ngIf="ngControl?.invalid && (ngControl?.dirty || ngControl?.touched)"
      class="alert margin-bottom"
    >
      <div *ngIf="ngControl?.errors?.['required']">{{ label }} is required.</div>
    </div>
  `,
})
export class SelectFieldComponent implements ControlValueAccessor {
  @Input() id = 'id';
  @Input() name = 'name';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() autoFocus = false;
  @Input() optionLabel = '';
  @Input() options!: Bean[];

  value: Bean | null = null;
  isDisabled = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: Bean) => {
    // Intentionally left blank; will be overwritten by registerOnChange
  };
  onTouched = () => {
    // no-op by default, will be overwritten by registerOnTouched
  };

  ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: Bean | null): void {
    this.value = obj;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSelect(value: Bean): void {
    this.value = value;
    this.onChange(value);
  }
}
