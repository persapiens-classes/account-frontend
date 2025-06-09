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
} from '@angular/core';
import { BeanDetailService } from './bean-detail-service';
import { BeanDetailServiceFactory } from './bean-detail-service-factory';

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
  beanDetailComponent!: Type<BeanDetailComponent<T>>;
  beanDetailInstance!: ComponentRef<BeanDetailComponent<T>>;

  beanDetailService: BeanDetailService<T>;

  constructor(
    private readonly router: Router,
    route: ActivatedRoute,
    beanServiceFactory: BeanDetailServiceFactory<T>,
  ) {
    this.beanDetailComponent = route.snapshot.data['beanDetailComponent'];

    this.beanDetailService = beanServiceFactory.getBeanDetailService(
      route.snapshot.data['serviceName'],
    );
  }

  ngAfterViewInit() {
    this.container.clear();
    this.beanDetailInstance = this.container.createComponent(this.beanDetailComponent);
  }

  list() {
    this.router.navigate([`${this.beanDetailService.beansName}`]);
  }

  startUpdate() {
    this.router.navigate([`${this.beanDetailService.beansName}/edit`], {
      state: { bean: this.beanDetailInstance.instance.bean },
    });
  }
}
