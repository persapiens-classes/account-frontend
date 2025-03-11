import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AutoFocusModule } from 'primeng/autofocus';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Owner } from './owner';
import { OwnerService } from './owner-service';

@Component({
  selector: 'owner-edit',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PanelModule, AutoFocusModule, DividerModule, CommonModule, TooltipModule],
  template: `
    <form [formGroup]="form">
      <p-panel header="Edit">
        <label for="name">Name:</label>
        <input id="name" 
          name="inputName"
          pInputText 
          [pAutoFocus]="true" 
          placeholder="Name to be edited" 
          formControlName="inputName" />
        <div
          *ngIf="form.get('inputName')?.invalid && (form.get('inputName')?.dirty || form.get('inputName')?.touched)"
          class="alert"
        >
          <div *ngIf="form.get('inputName')?.errors?.['required']">Name is required.</div>
          <div *ngIf="form.get('inputName')?.errors?.['minlength']">Name must be at least 3 characters long.</div>
        </div>
        <p-divider />
        <p-button icon="pi pi-check" (onClick)="update()" [style]="{'margin-right': '10px'}" [disabled]="form.invalid" pTooltip="Save the owner"/>
        <p-button icon="pi pi-times" (onClick)="cancelUpdate()" pTooltip="Cancel"/>
      </p-panel>
    </form>
  `
})
export class OwnerUpdateComponent {
  form: FormGroup
  owner: Owner

  constructor(
    private router: Router,
    private ownerService: OwnerService, 
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.owner = history.state.owner
    if (!this.owner) {
      this.router.navigate(['owners'])
    }

    this.form = this.formBuilder.group({
      inputName: [this.owner.name, [Validators.required, Validators.minLength(3)]]
    })
  }

  update() {
    if (this.form.valid) {
      const newOwner = new Owner(this.form.value.inputName)

      this.ownerService.update(this.owner.name, newOwner).pipe(
        tap((owner) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Owner edited',
            detail: 'Owner edited ok.'
          })
          this.router.navigate(["owners"])
        }),
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Owner not edited',
            detail: `Owner not edited: ${error.error.error}`
          })
          return of()
        })
      ).subscribe()
    }
  }

  cancelUpdate() {
    this.router.navigate(["owners"])
  }
}
