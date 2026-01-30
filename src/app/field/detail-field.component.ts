import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-field',
  imports: [CommonModule],
  template: `
    <div class="mb-2.5 flex items-center">
      <strong class="inline-block w-32.5 font-bold">{{ strong() }}</strong>
      <span [attr.data-cy]="dataCy()">{{ value() }}</span>
    </div>
  `,
})
export class DetailFieldComponent {
  strong = input.required<string>();
  value = input.required<string>();
  dataCy = input<string>('');
}
