import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { FormField, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-select-field',
  imports: [CommonModule, FloatLabelModule, SelectModule, FormField],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <p-select
        [id]="id()"
        [autofocus]="autoFocus()"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [formField]="field()"
        [attr.data-cy]="dataCy()"
        class="w-full max-w-75 min-w-50"
      />
      <label [for]="id()">{{ label() }}</label>
    </p-float-label>
    @if (state.invalid() && (state.dirty() || state.touched())) {
      <div class="alert mb-2.5">
        @for (error of state.errors(); track $index) {
          @if (error.kind === 'required') {
            <div>{{ label() }} is required.</div>
          }
        }
      </div>
    }
  `,
})
export class SelectFieldComponent<T = unknown> {
  id = input<string>('id');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  optionLabel = input.required<string>();
  options = input.required<T[]>();
  field = input.required<FieldTree<T | null>>();
  dataCy = input<string>(''); // Para testes Cypress

  get state() {
    return this.field()();
  }
}
