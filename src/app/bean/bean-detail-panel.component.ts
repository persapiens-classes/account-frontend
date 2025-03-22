import { ActivatedRoute, Router } from '@angular/router';
import { Bean } from './bean';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { BeanDetailComponent } from './bean-detail.component';
import { Component, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'bean-detail',
  imports: [CommonModule, ButtonModule, PanelModule],
  template: `
    <p-panel header="Detail">
      <ng-container #dynamicComponent></ng-container>

      <p-button icon="pi pi-list" (onClick)="list()" [style]="{'margin-right': '10px'}" pTooltip="Back to List"/>
      <p-button icon="pi pi-pencil" (onClick)="startUpdate()" pTooltip="Start Edit"/>
    </p-panel>
  `
})
export class BeanDetailPanelComponent<T extends Bean, I, U> {
  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  container!: ViewContainerRef
  beanDetailComponent!: Type<BeanDetailComponent<T, I, U>>
  beanDetailInstance!: ComponentRef<BeanDetailComponent<T, I, U>>

  constructor(private router: Router,
    route: ActivatedRoute
  ) {
    this.beanDetailComponent = route.snapshot.data['beanDetailComponent']
  }

  ngAfterViewInit() {
    this.container.clear()
    this.beanDetailInstance = this.container.createComponent(this.beanDetailComponent)
  }

  list() {
    this.router.navigate([`${this.beanDetailInstance.instance.beanService.beansName}`])
  }

  startUpdate() {
    this.router.navigate([`${this.beanDetailInstance.instance.beanService.beansName}/edit`], { state: { bean: this.beanDetailInstance.instance.bean } })
  }

}
