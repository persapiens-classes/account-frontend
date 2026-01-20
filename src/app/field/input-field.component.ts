import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormField, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-input-field',
  imports: [
    CommonModule,
    FloatLabelModule,
    AutoFocusModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    FormField,
  ],
  template: `
    <p-float-label variant="in" class="mb-2.5">
      <input
        [id]="calculatedId()"
        pInputText
        [type]="type()"
        [pAutoFocus]="autoFocus()"
        [formField]="formField()"
        [attr.data-cy]="dataCy()"
      />
      <label [for]="calculatedId()">{{ label() }}</label>
    </p-float-label>
    @if (state.invalid()) {
      <div class="alert mb-2.5">
        @for (error of state.errors(); track $index) {
          @if (error.kind === 'required') {
            <div>{{ label() }} is required.</div>
          }
          @if (error.kind === 'minlength') {
            <div>{{ label() }} must be at least 3 characters long.</div>
          }
          @if (error.kind === 'maxlength') {
            <div>{{ label() }} must not exceed 255 characters.</div>
          }
        }
      </div>
    }
  `,
})
export class InputFieldComponent {
  id = input<string>('');
  label = input.required<string>();
  autoFocus = input<boolean>(false);
  type = input<string>('text');
  formField = input.required<FieldTree<string>>();
  dataCy = input<string>('');

  calculatedId = computed(() => this.id() || this.label().toLowerCase() || this.dataCy());

  get state() {
    return this.formField()();
  }
}
