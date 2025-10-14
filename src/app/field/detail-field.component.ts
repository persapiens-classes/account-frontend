import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-field',
  imports: [CommonModule],
  template: `
    <div class="mb-2.5 flex items-center">
      <strong class="inline-block w-[130px] font-bold">{{ strong }}</strong>
      <span>{{ value }}</span>
    </div>
  `,
})
export class DetailFieldComponent {
  @Input() strong = '';
  @Input() value = '';
}
