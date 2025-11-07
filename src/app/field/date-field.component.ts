import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DatePickerModule } from 'primeng/datepicker';
import { DateFieldComponent as IDateFieldComponent } from './field-component';
import { Field, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-date-fields',
  imports: [CommonModule, FloatLabelModule, AutoFocusModule, DatePickerModule, Field],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <p-date-picker
        [id]="id()"
        [pAutoFocus]="autoFocus()"
        [showIcon]="showIcon()"
        [field]="field()"
      />
      <label [for]="id()">{{ label() }}</label>
    </p-float-label>
    @if (state.invalid() && (state.dirty() || state.touched())) {
      <div class="alert mb-2.5">
        @for (error of state.errors(); track $index) {
          @if (error.kind === 'required') {
            <div>{{ label() }} is required.</div>
          }
          @if (error.kind === 'min') {
            <div>{{ label() }} must be on or after the minimum date.</div>
          }
          @if (error.kind === 'max') {
            <div>{{ label() }} must be on or before the maximum date.</div>
          }
        }
      </div>
    }
  `,
})
export class DateFieldComponent implements IDateFieldComponent {
  id = input<string>('id');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  showIcon = input<boolean>(true);
  field = input.required<FieldTree<Date | null>>();

  get state() {
    return this.field()();
  }
}
