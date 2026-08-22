import { Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { MenubarModule } from '@openng/optimus-ui/menubar';
import { MenuItem, PassThroughContext } from '@openng/optimus-ui/api';
import { MenubarPassThrough } from '@openng/optimus-ui/types/menubar';
import { PATHS } from '../app.paths';

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
        routerLink: [`/${PATHS.BALANCE_PATH}`],
        dataCy: 'menu-balance',
      },
      {
        label: 'Credit Entry',
        icon: 'pi pi-arrow-up',
        routerLink: [`/credit${PATHS.ENTRY_PATH}`],
        dataCy: 'menu-credit-entry',
      },
      {
        label: 'Debit Entry',
        icon: 'pi pi-arrow-down',
        routerLink: [`/debit${PATHS.ENTRY_PATH}`],
        dataCy: 'menu-debit-entry',
      },
      {
        label: 'Transfer Entry',
        icon: 'pi pi-arrow-right',
        routerLink: [`/transfer${PATHS.ENTRY_PATH}`],
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
            routerLink: [`/credit${PATHS.ACCOUNT_PATH}`],
            dataCy: 'menu-account-credit',
          },
          {
            label: 'Debit Account',
            icon: 'pi pi-shopping-cart',
            routerLink: [`/debit${PATHS.ACCOUNT_PATH}`],
            dataCy: 'menu-account-debit',
          },
          {
            label: 'Equity Account',
            icon: 'pi pi-wallet',
            routerLink: [`/equity${PATHS.ACCOUNT_PATH}`],
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
            routerLink: [`/credit${PATHS.CATEGORY_PATH}`],
            dataCy: 'menu-category-credit',
          },
          {
            label: 'Debit Category',
            icon: 'pi pi-folder',
            routerLink: [`/debit${PATHS.CATEGORY_PATH}`],
            dataCy: 'menu-category-debit',
          },
          {
            label: 'Equity Category',
            icon: 'pi pi-wallet',
            routerLink: [`/equity${PATHS.CATEGORY_PATH}`],
            dataCy: 'menu-category-equity',
          },
        ],
      },
      {
        label: 'Owner',
        icon: 'pi pi-users',
        routerLink: [`/${PATHS.OWNER_PATH}`],
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
