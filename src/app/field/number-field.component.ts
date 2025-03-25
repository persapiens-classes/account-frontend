import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'a-number-field',
  imports: [CommonModule, FloatLabelModule, InputNumberModule, AutoFocusModule, InputTextModule, ReactiveFormsModule],
  template: `
    <p-float-label variant="in" class="margin-bottom">
      <p-inputnumber [id]="id" 
        [name]="name"
        [mode]="mode"
        [currency]="currency"
        [locale]="locale"
        [pAutoFocus]="autoFocus"
        [formControl]="formControl" />
      <label [for]="id">{{ label }}</label>
    </p-float-label>
    <div *ngIf="control.invalid && (control.dirty || control.touched)"
      class="alert margin-bottom">
      <div *ngIf="control?.errors?.['required']">{{ label }} is required.</div>
      <div *ngIf="control?.errors?.['minlength']">{{ label }} must be at least 3 characters long.</div>
    </div>
  `
})
export class NumberField {
  @Input() id: string = 'id'
  @Input() name: string = 'name'
  @Input() label: string = ''
  @Input() autoFocus: boolean = false
  @Input() mode: string ="currency"
  @Input() currency: string ="USD"
  @Input() locale: string ="en-US"
  @Input() control!: AbstractControl

  get formControl(): FormControl {
    return this.control as FormControl
  }
}
