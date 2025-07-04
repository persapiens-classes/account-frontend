import { ActivatedRoute, Router } from '@angular/router';
import { Bean } from './bean';
import { BeanListComponent } from './bean-list.component';
import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  inject,
} from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BeanListService } from './bean-list-service';
import { BeanListServiceFactory } from './bean-list-service-factory';

@Component({
  selector: 'app-bean-list',
  imports: [FormsModule, PanelModule, ButtonModule],
  template: `
    <p-panel header="List">
      <ng-template pTemplate="header">
        <div class="list-header">
          <p-button
            icon="pi pi-plus"
            (onClick)="startInsert()"
            autofocus="true"
            pTooltip="Start new owner"
          />
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
  `,
})
export class BeanListPanelComponent<T extends Bean> implements AfterViewInit {
  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef;
  beanListComponent!: Type<BeanListComponent<T>>;
  beanListInstance!: ComponentRef<BeanListComponent<T>>;

  beanListService: BeanListService<T>;

  private readonly router = inject(Router);
  constructor() {
    const route = inject(ActivatedRoute);
    this.beanListComponent = route.snapshot.data['beanListComponent'];

    this.beanListService = inject(BeanListServiceFactory<T>).getBeanListService(
      route.snapshot.data['serviceName'],
    );
  }

  ngAfterViewInit() {
    this.container.clear();
    this.beanListInstance = this.container.createComponent(this.beanListComponent);
  }

  startInsert(): void {
    this.router.navigate([`${this.beanListService.beansName}/new`]);
  }
}
