import { ActivatedRoute, Router } from '@angular/router';
import { Bean } from './bean';
import { BeanListComponent } from './bean-list.component';
import { Component, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'bean-list',
  imports: [FormsModule, PanelModule, ButtonModule],
  template: `
    <p-panel header="List">
      <ng-template pTemplate="header">
        <div class="list-header">
          <p-button icon="pi pi-plus" (onClick)="startInsert()" autofocus="true" pTooltip="Start new owner" />
        </div>
      </ng-template>

      <ng-container #dynamicComponent></ng-container>
    </p-panel>
  `,
  styles: `
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-left: 10px;
    }  
  `
})
export class BeanListPanelComponent<T extends Bean, I, U> {
  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef
  beanListComponent!: Type<BeanListComponent<T, I, U>>
  beanListInstance!: ComponentRef<BeanListComponent<T, I, U>>

  constructor(private router: Router,
    route: ActivatedRoute
  ) {
    this.beanListComponent = route.snapshot.data['beanListComponent']
  }

  ngAfterViewInit() {
    this.container.clear()
    this.beanListInstance = this.container.createComponent(this.beanListComponent)
  }

  startInsert(): void {
    this.router.navigate([`${this.beanListInstance.instance.beanService.beansName}/new`])
  }
}
