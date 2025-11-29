import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { Field, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-select-fields',
  imports: [CommonModule, FloatLabelModule, SelectModule, Field],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <p-select
        [id]="id()"
        [autofocus]="autoFocus()"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [field]="field()"
        [attr.data-cy]="dataCy()"
        class="w-full max-w-[300px] min-w-[200px]"
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
export class SelectFieldComponent {
  id = input<string>('id');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  optionLabel = input.required<string>();
  options = input.required<any[]>();
  field = input.required<FieldTree<any>>();
  dataCy = input<string>(''); // Para testes Cypress

  get state() {
    return this.field()();
  }
}
