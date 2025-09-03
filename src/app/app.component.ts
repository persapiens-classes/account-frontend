import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [FormsModule, PanelModule, RouterOutlet],
  template: `
    <main class="p-4 font-sans text-[18px]">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
