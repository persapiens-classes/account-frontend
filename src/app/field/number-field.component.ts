import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputNumberModule } from 'primeng/inputnumber';
import { NumberFieldComponent as INumberFieldComponent } from './field-component';
import { FormField, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-number-field',
  imports: [CommonModule, FloatLabelModule, AutoFocusModule, InputNumberModule, FormField],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <p-inputnumber
        [id]="calculatedId()"
        [mode]="mode()"
        [currency]="currency()"
        [locale]="locale()"
        [pAutoFocus]="autoFocus()"
        [formField]="field()"
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
            <div>{{ label() }} must be greater than or equal to the minimum value.</div>
          }
          @if (error.kind === 'max') {
            <div>{{ label() }} must be less than or equal to the maximum value.</div>
          }
        }
      </div>
    }
  `,
})
export class NumberFieldComponent implements INumberFieldComponent {
  id = input<string>('');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  mode = input<'decimal' | 'currency'>('currency');
  currency = input<string>('USD');
  locale = input<string>('en-US');
  field = input.required<FieldTree<number | null>>();
  dataCy = input<string>('');

  get state() {
    return this.field()();
  }

  calculatedId = computed(() => this.id() || this.label().toLowerCase() || this.dataCy());
}
