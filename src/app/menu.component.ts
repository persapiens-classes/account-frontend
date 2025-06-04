import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'a-menu',
  imports: [ButtonModule, TooltipModule, MenubarModule],
  template: ` <p-menubar [model]="items" /> `,
})
export class MenuComponent {
  items: MenuItem[];

  constructor() {
    this.items = [
      {
        label: 'Balance',
        icon: 'pi pi-arrow-up',
        routerLink: ['/balances'],
      },
      {
        label: 'Credit Entry',
        icon: 'pi pi-arrow-up',
        routerLink: ['/creditEntries'],
      },
      {
        label: 'Debit Entry',
        icon: 'pi pi-arrow-down',
        routerLink: ['/debitEntries'],
      },
      {
        label: 'Transfer Entry',
        icon: 'pi pi-arrow-right',
        routerLink: ['/transferEntries'],
      },
      {
        label: 'Account',
        icon: 'pi pi-list',
        items: [
          {
            label: 'Credit Account',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/creditAccounts'],
          },
          {
            label: 'Debit Account',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/debitAccounts'],
          },
          {
            label: 'Equity Account',
            icon: 'pi pi-wallet',
            routerLink: ['/equityAccounts'],
          },
        ],
      },
      {
        label: 'Category',
        icon: 'pi pi-folder',
        items: [
          {
            label: 'Credit Category',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/creditCategories'],
          },
          {
            label: 'Debit Category',
            icon: 'pi pi-folder',
            routerLink: ['/debitCategories'],
          },
          {
            label: 'Equity Category',
            icon: 'pi pi-wallet',
            routerLink: ['/equityCategories'],
          },
        ],
      },
      {
        label: 'Owner',
        icon: 'pi pi-users',
        routerLink: ['/owners'],
      },
    ];
  }
}
