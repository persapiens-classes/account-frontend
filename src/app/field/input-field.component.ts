import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-field',
  imports: [
    CommonModule,
    FloatLabelModule,
    AutoFocusModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  template: `
    <p-float-label variant="in" class="margin-bottom">
      <input
        [id]="id"
        [name]="name"
        pInputText
        [pAutoFocus]="autoFocus"
        [value]="value"
        [disabled]="isDisabled"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
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
export class InputFieldComponent implements ControlValueAccessor {
  @Input() id = 'id';
  @Input() name = 'name';
  @Input() label = '';
  @Input() autoFocus = false;

  value = '';
  isDisabled = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: string) => {
    // No-op default implementation to satisfy linter
  };
  onTouched = () => {
    // Mark as touched or perform any necessary action
    // This can be left as a no-op if not needed, but should not be empty
  };

  ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }
}
