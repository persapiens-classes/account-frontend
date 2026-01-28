import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DatePickerModule } from 'primeng/datepicker';
import { DateFieldComponent as IDateFieldComponent } from './field-component';
import { FormField, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-date-field',
  imports: [CommonModule, FloatLabelModule, AutoFocusModule, DatePickerModule, FormField],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <p-date-picker
        [id]="calculatedId()"
        [pAutoFocus]="autoFocus()"
        [showIcon]="showIcon()"
        [formField]="$any(formField())"
        [attr.data-cy]="dataCy()"
      />
      <label [for]="calculatedId()">{{ label() }}</label>
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
  id = input<string>('');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  showIcon = input<boolean>(true);
  formField = input.required<FieldTree<Date | null>>();
  dataCy = input<string>('');

  get state() {
    return this.formField()();
  }

  calculatedId = computed(() => this.id() || this.label().toLowerCase() || this.dataCy());
}
