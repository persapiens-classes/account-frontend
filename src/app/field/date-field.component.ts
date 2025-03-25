import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoFocusModule } from 'primeng/autofocus';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'a-date-field',
  imports: [CommonModule, FloatLabelModule, DatePickerModule, AutoFocusModule, InputTextModule, ReactiveFormsModule],
  template: `
    <p-float-label variant="in" class="margin-bottom">
      <p-date-picker [id]="id" 
        [name]="name"
        [pAutoFocus]="autoFocus"
        [showIcon]="showIcon"
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
export class DateField {
  @Input() id: string = 'id'
  @Input() name: string = 'name'
  @Input() label: string = ''
  @Input() autoFocus: boolean = false
  @Input() showIcon: boolean =true
  @Input() control!: AbstractControl

  get formControl(): FormControl {
    return this.control as FormControl
  }
}
