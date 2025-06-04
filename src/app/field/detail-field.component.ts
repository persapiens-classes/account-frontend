import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'a-detail-field',
  imports: [CommonModule],
  template: `
    <div class="margin-bottom detail-field">
      <strong>{{ strong }}</strong>
      {{ value }}
    </div>
  `,
  styles: `
    .detail-field {
      display: flex;
      align-items: center;
    }

    .detail-field strong {
      display: inline-block;
      width: 130px;
      font-weight: bold;
    }
  `,
})
export class DetailField {
  @Input() strong: string = '';
  @Input() value: string = '';
}
