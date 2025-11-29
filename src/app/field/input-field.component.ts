import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Field, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-input-fields',
  imports: [
    CommonModule,
    FloatLabelModule,
    AutoFocusModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    Field,
  ],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <input
        [id]="id()"
        pInputText
        [pAutoFocus]="autoFocus()"
        [field]="field()"
        [attr.data-cy]="dataCy()"
      />
      <label [for]="id()">{{ label() }}</label>
    </p-float-label>
    @if (state.invalid() && (state.dirty() || state.touched())) {
      <div class="alert mb-2.5">
        @for (error of state.errors(); track $index) {
          @if (error.kind === 'required') {
            <div>{{ label() }} is required.</div>
          }
          @if (error.kind === 'minlength') {
            <div>{{ label() }} must be at least 3 characters long.</div>
          }
        }
      </div>
    }
  `,
})
export class InputFieldComponent {
  id = input<string>('id');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  field = input.required<FieldTree<string>>();
  dataCy = input<string>('');

  get state() {
    return this.field()();
  }
}
