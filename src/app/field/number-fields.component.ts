import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputNumberModule } from 'primeng/inputnumber';
import { NumberFieldSComponent as INumberFieldSComponent } from './fields-component';
import { Field, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-number-fields',
  imports: [CommonModule, FloatLabelModule, AutoFocusModule, InputNumberModule, Field],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <p-inputnumber
        [id]="id()"
        [name]="name()"
        [mode]="mode()"
        [currency]="currency()"
        [locale]="locale()"
        [pAutoFocus]="autoFocus()"
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
export class NumberFieldSComponent implements INumberFieldSComponent {
  id = input<string>('id');
  name = input<string>('name');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  mode = input<'decimal' | 'currency'>('currency');
  currency = input<string>('USD');
  locale = input<string>('en-US');
  field = input.required<FieldTree<number | null>>();

  get state() {
    return this.field()();
  }
}
