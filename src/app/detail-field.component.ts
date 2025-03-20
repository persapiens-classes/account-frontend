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
  `
})
export class DetailField {
  @Input() strong: string = ''
  @Input() value: string = ''
}
