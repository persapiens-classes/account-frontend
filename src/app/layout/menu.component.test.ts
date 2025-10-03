import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MenuComponent } from './menu.component';
import { MenuItem } from 'primeng/api';
import { FieldTestUtils } from '../shared/test-utils';

// Mock component for router testing
import { Component } from '@angular/core';

@Component({
  selector: 'app-mock',
  template: '<div>Mock Component</div>',
})
class MockComponent {}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideRouter([
          { path: 'balances', component: MockComponent },
          { path: 'creditEntries', component: MockComponent },
          { path: 'debitEntries', component: MockComponent },
          { path: 'transferEntries', component: MockComponent },
          { path: 'creditAccounts', component: MockComponent },
          { path: 'debitAccounts', component: MockComponent },
          { path: 'equityAccounts', component: MockComponent },
          { path: 'creditCategories', component: MockComponent },
          { path: 'debitCategories', component: MockComponent },
          { path: 'equityCategories', component: MockComponent },
          { path: 'owners', component: MockComponent },
        ]),
      ],
    }).compileComponents();

    fixture = FieldTestUtils.createFixture(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component).toBeInstanceOf(MenuComponent);
      expect(Array.isArray(component.items)).toBe(true);
    });

    it('should initialize items in constructor', () => {
      expect(component.items).toBeDefined();
      expect(component.items.length).toBeGreaterThan(0);
    });
  });

  describe('Menu Items Structure', () => {
    it('should have correct number of top-level menu items', () => {
      expect(component.items.length).toBe(7);
    });

    it('should have main navigation items with correct properties', () => {
      const expectedMainItems = [
        { label: 'Balance', icon: 'pi pi-arrow-up', routerLink: ['/balances'] },
        { label: 'Credit Entry', icon: 'pi pi-arrow-up', routerLink: ['/creditEntries'] },
        { label: 'Debit Entry', icon: 'pi pi-arrow-down', routerLink: ['/debitEntries'] },
        { label: 'Transfer Entry', icon: 'pi pi-arrow-right', routerLink: ['/transferEntries'] },
        { label: 'Owner', icon: 'pi pi-users', routerLink: ['/owners'] },
      ];

      expectedMainItems.forEach((expectedItem) => {
        const menuItem = component.items.find((item) => item.label === expectedItem.label);
        expect(menuItem).toBeDefined();
        expect(menuItem?.icon).toBe(expectedItem.icon);
        expect(menuItem?.routerLink).toEqual(expectedItem.routerLink);
      });
    });
  });

  describe('Submenu Items - Account', () => {
    let accountItem: MenuItem | undefined;

    beforeEach(() => {
      accountItem = component.items.find((item) => item.label === 'Account');
    });

    it('should have Account menu item with submenu', () => {
      expect(accountItem).toBeDefined();
      expect(accountItem?.label).toBe('Account');
      expect(accountItem?.icon).toBe('pi pi-list');
      expect(accountItem?.items).toBeDefined();
      expect(accountItem?.items?.length).toBe(3);
    });

    it('should have Account submenu items with correct properties', () => {
      const expectedSubItems = [
        { label: 'Credit Account', icon: 'pi pi-graduation-cap', routerLink: ['/creditAccounts'] },
        { label: 'Debit Account', icon: 'pi pi-shopping-cart', routerLink: ['/debitAccounts'] },
        { label: 'Equity Account', icon: 'pi pi-wallet', routerLink: ['/equityAccounts'] },
      ];

      expectedSubItems.forEach((expectedSubItem) => {
        const subItem = accountItem?.items?.find((item) => item.label === expectedSubItem.label);
        expect(subItem).toBeDefined();
        expect(subItem?.icon).toBe(expectedSubItem.icon);
        expect(subItem?.routerLink).toEqual(expectedSubItem.routerLink);
      });
    });
  });

  describe('Submenu Items - Category', () => {
    let categoryItem: MenuItem | undefined;

    beforeEach(() => {
      categoryItem = component.items.find((item) => item.label === 'Category');
    });

    it('should have Category menu item with submenu', () => {
      expect(categoryItem).toBeDefined();
      expect(categoryItem?.label).toBe('Category');
      expect(categoryItem?.icon).toBe('pi pi-folder');
      expect(categoryItem?.items).toBeDefined();
      expect(categoryItem?.items?.length).toBe(3);
    });

    it('should have Category submenu items with correct properties', () => {
      const expectedSubItems = [
        {
          label: 'Credit Category',
          icon: 'pi pi-graduation-cap',
          routerLink: ['/creditCategories'],
        },
        { label: 'Debit Category', icon: 'pi pi-folder', routerLink: ['/debitCategories'] },
        { label: 'Equity Category', icon: 'pi pi-wallet', routerLink: ['/equityCategories'] },
      ];

      expectedSubItems.forEach((expectedSubItem) => {
        const subItem = categoryItem?.items?.find((item) => item.label === expectedSubItem.label);
        expect(subItem).toBeDefined();
        expect(subItem?.icon).toBe(expectedSubItem.icon);
        expect(subItem?.routerLink).toEqual(expectedSubItem.routerLink);
      });
    });
  });

  describe('Template Rendering', () => {
    it('should render p-menubar component', () => {
      const menubarElement = fixture.nativeElement.querySelector('p-menubar');
      expect(menubarElement).toBeTruthy();
    });

    it('should bind items to menubar model', () => {
      const menubarElement = fixture.debugElement.query(By.css('p-menubar'));
      expect(menubarElement.componentInstance.model).toBe(component.items);
    });

    it('should have minimal template structure', () => {
      const template = fixture.nativeElement;
      expect(template.children.length).toBe(1);
      expect(template.firstElementChild.tagName.toLowerCase()).toBe('p-menubar');
    });
  });

  describe('Menu Item Properties Validation', () => {
    it('should have all top-level items with required properties', () => {
      component.items.forEach((item) => {
        expect(item.label).toBeDefined();
        expect(typeof item.label).toBe('string');
        expect(item.icon).toBeDefined();
        expect(typeof item.icon).toBe('string');
      });
    });

    it('should have navigation items with routerLink', () => {
      const navigationItems = component.items.filter((item) => !item.items);
      navigationItems.forEach((item) => {
        expect(item.routerLink).toBeDefined();
        expect(Array.isArray(item.routerLink)).toBe(true);
      });
    });

    it('should have submenu items with proper structure', () => {
      const submenuItems = component.items.filter((item) => item.items && item.items.length > 0);
      submenuItems.forEach((parentItem) => {
        expect(parentItem.items).toBeDefined();
        parentItem.items?.forEach((subItem) => {
          expect(subItem.label).toBeDefined();
          expect(subItem.icon).toBeDefined();
          expect(subItem.routerLink).toBeDefined();
        });
      });
    });
  });

  describe('Component Behavior', () => {
    it('should not modify items after initialization', () => {
      const originalItemsLength = component.items.length;
      const originalFirstItem = { ...component.items[0] };

      // Simulate some time passing
      fixture.detectChanges();

      expect(component.items.length).toBe(originalItemsLength);
      expect(component.items[0].label).toBe(originalFirstItem.label);
      expect(component.items[0].icon).toBe(originalFirstItem.icon);
    });

    it('should maintain consistent menu structure', () => {
      const expectedLabels = [
        'Balance',
        'Credit Entry',
        'Debit Entry',
        'Transfer Entry',
        'Account',
        'Category',
        'Owner',
      ];

      expect(component.items.length).toBe(expectedLabels.length);

      // Test each menu item individually to avoid security warnings
      expect(component.items[0]?.label).toBe('Balance');
      expect(component.items[1]?.label).toBe('Credit Entry');
      expect(component.items[2]?.label).toBe('Debit Entry');
      expect(component.items[3]?.label).toBe('Transfer Entry');
      expect(component.items[4]?.label).toBe('Account');
      expect(component.items[5]?.label).toBe('Category');
      expect(component.items[6]?.label).toBe('Owner');
    });
  });

  describe('Icons and Visual Elements', () => {
    it('should use appropriate icons for each menu item', () => {
      const iconMap = new Map([
        ['Balance', 'pi pi-arrow-up'],
        ['Credit Entry', 'pi pi-arrow-up'],
        ['Debit Entry', 'pi pi-arrow-down'],
        ['Transfer Entry', 'pi pi-arrow-right'],
        ['Account', 'pi pi-list'],
        ['Category', 'pi pi-folder'],
        ['Owner', 'pi pi-users'],
      ]);

      component.items.forEach((item) => {
        const expectedIcon = iconMap.get(item.label!);
        expect(item.icon).toBe(expectedIcon);
      });
    });

    it('should have consistent icon themes for related items', () => {
      // Credit items should use graduation cap icon
      const creditItems = component.items
        .flatMap((item) => item.items || [])
        .filter((item) => item.label?.includes('Credit'));

      creditItems.forEach((item) => {
        expect(item.icon).toBe('pi pi-graduation-cap');
      });

      // Equity items should use wallet icon
      const equityItems = component.items
        .flatMap((item) => item.items || [])
        .filter((item) => item.label?.includes('Equity'));

      equityItems.forEach((item) => {
        expect(item.icon).toBe('pi pi-wallet');
      });
    });
  });

  describe('Navigation Structure', () => {
    it('should have correct route paths for all navigation items', () => {
      const allNavigationItems = [
        ...component.items.filter((item) => item.routerLink),
        ...component.items.flatMap((item) => item.items || []).filter((item) => item.routerLink),
      ];

      allNavigationItems.forEach((item) => {
        expect(item.routerLink).toBeDefined();
        expect(Array.isArray(item.routerLink)).toBe(true);
        expect(item.routerLink!.length).toBe(1);
        expect(typeof item.routerLink![0]).toBe('string');
        expect(item.routerLink![0]).toMatch(/^\/[a-zA-Z]+$/);
      });
    });

    it('should not have duplicate route paths', () => {
      const allNavigationItems = [
        ...component.items.filter((item) => item.routerLink),
        ...component.items.flatMap((item) => item.items || []).filter((item) => item.routerLink),
      ];

      const routePaths = allNavigationItems.map((item) => item.routerLink![0]);
      const uniqueRoutePaths = [...new Set(routePaths)];

      expect(routePaths.length).toBe(uniqueRoutePaths.length);
    });
  });
});
