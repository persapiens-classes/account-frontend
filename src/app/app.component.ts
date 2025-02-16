import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [FormsModule, PanelModule, RouterOutlet],
  template: `
    <main class="main">
          <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  names: Array<string> = []

  insert(name: string) {
    this.names.push(name)
  }

  remove(item: string) {
    this.names = this.names.filter(internalName => internalName !== item)
  }
}
