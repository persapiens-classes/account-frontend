import { ActivatedRoute, Router } from '@angular/router';
import { Bean } from './bean';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { BeanDetailComponent } from './bean-detail.component';
import {
  Component,
  ComponentRef,
  Type,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-bean-detail',
  imports: [CommonModule, ButtonModule, PanelModule],
  template: `
    <p-panel header="Detail">
      <ng-container #dynamicComponent></ng-container>

      <p-button
        icon="pi pi-list"
        (onClick)="list()"
        [style]="{ 'margin-right': '10px' }"
        pTooltip="Back to List"
      />
      <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit" />
    </p-panel>
  `,
})
export class BeanDetailPanelComponent<T extends Bean> implements AfterViewInit {
  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef;
  beanDetailComponentType!: Type<BeanDetailComponent<T>>;
  beanDetailComponentInstance!: ComponentRef<BeanDetailComponent<T>>;
  routerName!: string;

  private readonly router = inject(Router);

  constructor() {
    const route = inject(ActivatedRoute);
    this.beanDetailComponentType = route.snapshot.data['beanDetailComponent'];
    this.routerName = route.snapshot.data['routerName'];
  }

  ngAfterViewInit() {
    this.container.clear();
    this.beanDetailComponentInstance = this.container.createComponent(this.beanDetailComponentType);
  }

  list() {
    this.router.navigate([`${this.routerName}`]);
  }

  startUpdate() {
    this.router.navigate([`${this.routerName}/edit`], {
      state: { bean: this.beanDetailComponentInstance.instance.bean },
    });
  }
}
