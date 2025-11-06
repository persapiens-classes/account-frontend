import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [PanelModule, RouterOutlet],
  template: `
    <main class="p-4 font-sans text-[18px]">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
