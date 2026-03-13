import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, PassThroughContext } from 'primeng/api';
import { MenubarPassThrough } from 'primeng/types/menubar';

interface MenuItemWithDataCy extends MenuItem {
  dataCy?: string;
}

@Component({
  selector: 'app-menu',
  imports: [ButtonModule, TooltipModule, MenubarModule],
  template: `<p-menubar [model]="items" [pt]="menubarPt"></p-menubar>`,
})
export class MenuComponent {
  items: MenuItemWithDataCy[];
  menubarPt: MenubarPassThrough;

  constructor() {
    this.items = [
      {
        label: 'Balance',
        icon: 'pi pi-arrow-up',
        routerLink: ['/balances'],
        dataCy: 'menu-balance',
      },
      {
        label: 'Credit Entry',
        icon: 'pi pi-arrow-up',
        routerLink: ['/creditEntries'],
        dataCy: 'menu-credit-entry',
      },
      {
        label: 'Debit Entry',
        icon: 'pi pi-arrow-down',
        routerLink: ['/debitEntries'],
        dataCy: 'menu-debit-entry',
      },
      {
        label: 'Transfer Entry',
        icon: 'pi pi-arrow-right',
        routerLink: ['/transferEntries'],
        dataCy: 'menu-transfer-entry',
      },
      {
        label: 'Account',
        icon: 'pi pi-list',
        dataCy: 'menu-account',
        items: [
          {
            label: 'Credit Account',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/creditAccounts'],
            dataCy: 'menu-account-credit',
          },
          {
            label: 'Debit Account',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/debitAccounts'],
            dataCy: 'menu-account-debit',
          },
          {
            label: 'Equity Account',
            icon: 'pi pi-wallet',
            routerLink: ['/equityAccounts'],
            dataCy: 'menu-account-equity',
          },
        ],
      },
      {
        label: 'Category',
        icon: 'pi pi-folder',
        dataCy: 'menu-category',
        items: [
          {
            label: 'Credit Category',
            icon: 'pi pi-graduation-cap',
            routerLink: ['/creditCategories'],
            dataCy: 'menu-category-credit',
          },
          {
            label: 'Debit Category',
            icon: 'pi pi-folder',
            routerLink: ['/debitCategories'],
            dataCy: 'menu-category-debit',
          },
          {
            label: 'Equity Category',
            icon: 'pi pi-wallet',
            routerLink: ['/equityCategories'],
            dataCy: 'menu-category-equity',
          },
        ],
      },
      {
        label: 'Owner',
        icon: 'pi pi-users',
        routerLink: ['/owners'],
        dataCy: 'menu-owner',
      },
    ];

    this.menubarPt = {
      itemLink: (
        options: PassThroughContext<unknown, unknown> & {
          context?: { item?: MenuItemWithDataCy };
        },
      ) => ({
        'data-cy': options?.context?.item?.dataCy || null,
      }),
    };
  }
}
