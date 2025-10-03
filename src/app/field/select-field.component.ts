import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgControl, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Bean } from '../bean/bean';
import { SelectFieldComponent as ISelectFieldComponent } from './field-component';

@Component({
  selector: 'app-select-field',
  imports: [CommonModule, FloatLabelModule, SelectModule, FormsModule],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <p-select
        [id]="id"
        [name]="name"
        [autofocus]="autoFocus"
        [options]="options"
        optionLabel="{{ optionLabel }}"
        [disabled]="isDisabled"
        [(ngModel)]="value"
        (onChange)="onSelect($event.value)"
        (onBlur)="onTouched()"
        class="min-w-[200px] max-w-[300px] w-full"
      />
      <label [for]="id">{{ label }}</label>
    </p-float-label>
    @if (ngControl?.invalid && (ngControl?.dirty || ngControl?.touched)) {
      <div class="alert mb-2.5">
        @if (ngControl?.errors?.['required']) {
          <div>{{ label }} is required.</div>
        }
      </div>
    }
  `,
})
export class SelectFieldComponent implements ISelectFieldComponent<Bean> {
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
  onChange = (_: Bean | null) => {
    // Intentionally left blank; will be overwritten by registerOnChange
  };
  onTouched = () => {
    // no-op by default, will be overwritten by registerOnTouched
  };

  ngControl = inject(NgControl, { optional: true }) || undefined;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: Bean | null): void {
    this.value = obj;
  }

  registerOnChange(fn: (value: Bean | null) => void): void {
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
