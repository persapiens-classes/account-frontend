import { ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { WritableSignal, signal } from '@angular/core';
import { expect, describe, it, beforeEach, vi } from 'vitest';

import { OwnerListComponent } from './owner-list.component';
import { OwnerListService } from './owner-list-service';
import { OwnerRemoveService } from './owner-remove-service';
import { Owner } from './owner';
import { TestUtils } from '../shared/test-utils';
import { AppMessageService } from '../app-message-service';

describe('OwnerListComponent', () => {
  let component: OwnerListComponent;
  let fixture: ComponentFixture<OwnerListComponent>;
  let mockOwnerListService: {
    findAll: ReturnType<typeof vi.fn>;
  };
  let mockOwnerRemoveService: OwnerRemoveService;
  let mockRouter: {
    navigate: ReturnType<typeof vi.fn>;
  };
  let mockAppMessageService: {
    addErrorMessage: ReturnType<typeof vi.fn>;
    addSuccessMessage: ReturnType<typeof vi.fn>;
  };
  let mockOwnersSignal: WritableSignal<Owner[]>;

  beforeEach(async () => {
    // Create test data
    const testOwners = [new Owner('Owner 1'), new Owner('Owner 2'), new Owner('Owner & Co. Ltd.')];

    // Create signals for reactive data
    mockOwnersSignal = signal(testOwners);

    // Create service mocks
    mockOwnerListService = {
      findAll: vi.fn().mockReturnValue(mockOwnersSignal),
    };

    mockOwnerRemoveService = {
      remove: vi.fn(),
    } as unknown as OwnerRemoveService;

    mockRouter = {
      navigate: vi.fn(),
    };

    mockAppMessageService = {
      addErrorMessage: vi.fn(),
      addSuccessMessage: vi.fn(),
    };

    await TestUtils.setupComponentTestBed(OwnerListComponent, [
      { provide: OwnerListService, useValue: mockOwnerListService },
      { provide: OwnerRemoveService, useValue: mockOwnerRemoveService },
      { provide: Router, useValue: mockRouter },
      { provide: AppMessageService, useValue: mockAppMessageService },
    ]);

    fixture = TestUtils.createFixture(OwnerListComponent);
    component = fixture.componentInstance;
  });

  // Basic component structure tests using TestUtils
  describe('Component Initialization', () => {
    it('should create component successfully', () => {
      TestUtils.testBasicInitialization(
        component,
        {
          beanName: 'Owner',
          routerName: 'owners',
        },
        OwnerListComponent,
      );
      expect(component).toBeTruthy();
    });

    it('should have correct default properties', () => {
      expect(component.beanName).toBe('Owner');
      expect(component.routerName).toBe('owners');
      expect(component.beanRemoveService).toBe(mockOwnerRemoveService);
      expect(component.beansList).toBe(mockOwnersSignal);
    });

    it('should inject required services', () => {
      expect(component.beanRemoveService).toBeDefined();
      expect(component.beansList).toBeDefined();
      expect(mockOwnerListService.findAll).toHaveBeenCalled();
    });
  });

  // Component rendering tests
  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render BeanListPanelComponent with correct routerName', () => {
      const beanListPanel = fixture.debugElement.query(By.css('app-bean-list-panel'));
      expect(beanListPanel).toBeTruthy();
      expect(beanListPanel.componentInstance.routerName).toBe('owners');
    });

    it('should render PrimeNG table with correct configuration', () => {
      const table = fixture.debugElement.query(By.css('p-table'));
      expect(table).toBeTruthy();

      const tableComponent = table.componentInstance;
      expect(tableComponent.value).toBe(mockOwnersSignal());
      expect(tableComponent.rows).toBe(5);
      expect(tableComponent.paginator).toBe(true);
      expect(tableComponent.rowsPerPageOptions).toEqual([5, 7, 10]);
      // stripedRows property may be converted to boolean by Angular
      expect(tableComponent.stripedRows).toBeTruthy();
    });

    it('should render table headers correctly', () => {
      const tableHeaders = fixture.nativeElement.querySelectorAll('th');
      expect(tableHeaders.length).toBeGreaterThan(0);

      const headerTexts = Array.from(tableHeaders as NodeListOf<Element>).map((th) =>
        th.textContent?.trim(),
      );
      expect(headerTexts).toContain('Name');
      expect(headerTexts).toContain('Detail');
      expect(headerTexts).toContain('Edit');
      expect(headerTexts).toContain('Remove');
    });

    it('should render sortable column for name', () => {
      const sortableColumn = fixture.debugElement.query(By.css('[pSortableColumn="name"]'));
      expect(sortableColumn).toBeTruthy();

      const sortIcon = fixture.debugElement.query(By.css('p-sortIcon[field="name"]'));
      expect(sortIcon).toBeTruthy();
    });

    it('should render column filter for name field', () => {
      const columnFilter = fixture.debugElement.query(By.css('p-columnFilter[field="name"]'));
      expect(columnFilter).toBeTruthy();
      expect(columnFilter.componentInstance.type).toBe('text');
      expect(columnFilter.componentInstance.placeholder).toBe('name');
      expect(columnFilter.componentInstance.ariaLabel).toBe('Filter Name');
    });

    it('should render owner data in table rows', () => {
      const testOwners = mockOwnersSignal();
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(testOwners.length);

      // Check first row data
      const firstRowCells = rows[0].querySelectorAll('td');
      expect(firstRowCells[0].textContent.trim()).toBe(testOwners[0].name);
    });

    it('should render action buttons for each row', () => {
      const detailButtons = fixture.debugElement.queryAll(By.css('app-start-detail-button'));
      const updateButtons = fixture.debugElement.queryAll(By.css('app-start-update-button'));
      const removeButtons = fixture.debugElement.queryAll(By.css('app-remove-button'));

      const ownerCount = mockOwnersSignal().length;
      expect(detailButtons.length).toBe(ownerCount);
      expect(updateButtons.length).toBe(ownerCount);
      expect(removeButtons.length).toBe(ownerCount);
    });
  });

  // Button component integration tests
  describe('Action Button Integration', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should pass correct props to StartDetailButton components', () => {
      const detailButtons = fixture.debugElement.queryAll(By.css('app-start-detail-button'));
      const testOwners = mockOwnersSignal();

      detailButtons.forEach((button, index) => {
        expect(index).toBeLessThan(testOwners.length);
        const expectedOwner = testOwners.at(index);
        expect(expectedOwner).toBeDefined();
        expect(button.componentInstance.item).toBe(expectedOwner);
        expect(button.componentInstance.routerName).toBe('owners');
      });
    });

    it('should pass correct props to StartUpdateButton components', () => {
      const updateButtons = fixture.debugElement.queryAll(By.css('app-start-update-button'));
      const testOwners = mockOwnersSignal();

      updateButtons.forEach((button, index) => {
        expect(index).toBeLessThan(testOwners.length);
        const expectedOwner = testOwners.at(index);
        expect(expectedOwner).toBeDefined();
        expect(button.componentInstance.item).toBe(expectedOwner);
        expect(button.componentInstance.routerName).toBe('owners');
      });
    });

    it('should pass correct props to RemoveButton components', () => {
      const removeButtons = fixture.debugElement.queryAll(By.css('app-remove-button'));
      const testOwners = mockOwnersSignal();

      removeButtons.forEach((button, index) => {
        expect(index).toBeLessThan(testOwners.length);
        const expectedOwner = testOwners.at(index);
        expect(expectedOwner).toBeDefined();
        expect(button.componentInstance.beansList).toBe(mockOwnersSignal);
        expect(button.componentInstance.item).toBe(expectedOwner);
        expect(button.componentInstance.beanRemoveService).toBe(mockOwnerRemoveService);
        expect(button.componentInstance.beanName).toBe('Owner');
      });
    });
  });

  // Reactive data tests
  describe('Reactive Data Handling', () => {
    it('should update table when owners list changes', () => {
      fixture.detectChanges();

      // Initial state
      expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(3);

      // Update signal with new data
      const newOwners = [new Owner('New Owner Only')];
      mockOwnersSignal.set(newOwners);
      fixture.detectChanges();

      // Check updated state
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
      expect(rows[0].querySelector('td').textContent.trim()).toBe('New Owner Only');
    });

    it('should handle empty owners list', () => {
      mockOwnersSignal.set([]);
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(0);

      const detailButtons = fixture.debugElement.queryAll(By.css('app-start-detail-button'));
      const updateButtons = fixture.debugElement.queryAll(By.css('app-start-update-button'));
      const removeButtons = fixture.debugElement.queryAll(By.css('app-remove-button'));

      expect(detailButtons.length).toBe(0);
      expect(updateButtons.length).toBe(0);
      expect(removeButtons.length).toBe(0);
    });

    it('should handle owners with special characters', () => {
      const specialOwners = [
        new Owner('Owner & Co. Ltd.'),
        new Owner('Owner "Quoted" Name'),
        new Owner("Owner's Possessive"),
        new Owner('Owner <script>alert("xss")</script>'),
      ];

      mockOwnersSignal.set(specialOwners);
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(4);

      // Check that special characters are properly rendered (escaped)
      const cellTexts = Array.from(rows as NodeListOf<Element>).map((row) =>
        row.querySelector('td')?.textContent?.trim(),
      );

      expect(cellTexts).toContain('Owner & Co. Ltd.');
      expect(cellTexts).toContain('Owner "Quoted" Name');
      expect(cellTexts).toContain("Owner's Possessive");
      // XSS attempt should be rendered as text, not executed
      expect(cellTexts).toContain('Owner <script>alert("xss")</script>');
    });
  });

  // Service integration tests
  describe('Service Integration', () => {
    it('should call OwnerListService.findAll on initialization', () => {
      expect(mockOwnerListService.findAll).toHaveBeenCalled();
      expect(mockOwnerListService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should use OwnerRemoveService instance', () => {
      expect(component.beanRemoveService).toBe(mockOwnerRemoveService);
      expect(component.beanRemoveService).toBeInstanceOf(Object);
    });

    it('should maintain reactive connection to service data', () => {
      const initialOwners = mockOwnersSignal();
      expect(component.beansList()).toBe(initialOwners);

      // Change the signal
      const newOwners = [new Owner('Changed Owner')];
      mockOwnersSignal.set(newOwners);

      // Component should reflect the change
      expect(component.beansList()).toBe(newOwners);
      expect(component.beansList()).not.toBe(initialOwners);
    });
  });

  // Component structure and properties tests
  describe('Component Structure', () => {
    it('should have correct component metadata', () => {
      expect(component.constructor.name).toBe('OwnerListComponent');
    });

    it('should have correct bean configuration', () => {
      expect(component.beanName).toBe('Owner');
      expect(component.routerName).toBe('owners');
    });

    it('should implement required component interface', () => {
      expect(typeof component.beanName).toBe('string');
      expect(typeof component.routerName).toBe('string');
      expect(component.beanRemoveService).toBeDefined();
      expect(component.beansList).toBeDefined();
      expect(typeof component.beansList).toBe('function'); // Signal is a function
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    it('should handle null/undefined owner names gracefully', () => {
      const edgeCaseOwners = [
        new Owner(''),
        new Owner('   '), // whitespace only
        new Owner('Normal Owner'),
      ];

      mockOwnersSignal.set(edgeCaseOwners);
      fixture.detectChanges();

      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(3);

      // All rows should render without throwing errors
      Array.from(rows as NodeListOf<Element>).forEach((row) => {
        const nameCell = row.querySelector('td');
        expect(nameCell).toBeTruthy();
      });
    });

    it('should maintain component stability with large datasets', () => {
      const largeOwnerList = Array.from({ length: 100 }, (_, i) => new Owner(`Owner ${i + 1}`));

      mockOwnersSignal.set(largeOwnerList);
      fixture.detectChanges();

      // Component should handle large datasets without errors
      expect(component.beansList().length).toBe(100);

      // Table should still render (though pagination may limit visible rows)
      const table = fixture.debugElement.query(By.css('p-table'));
      expect(table).toBeTruthy();
      expect(table.componentInstance.value.length).toBe(100);
    });

    it('should handle rapid data changes', () => {
      fixture.detectChanges();

      // Simulate rapid data changes
      for (let i = 0; i < 5; i++) {
        const newOwners = Array.from(
          { length: i + 1 },
          (_, j) => new Owner(`Rapid Owner ${i}-${j}`),
        );
        mockOwnersSignal.set(newOwners);
        fixture.detectChanges();
      }

      // Component should remain stable
      expect(component.beansList().length).toBe(5);
      expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper ARIA labels for filter input', () => {
      const columnFilter = fixture.debugElement.query(By.css('p-columnFilter[field="name"]'));
      expect(columnFilter.componentInstance.ariaLabel).toBe('Filter Name');
    });

    it('should have sortable columns with proper attributes', () => {
      const sortableColumn = fixture.debugElement.query(By.css('[pSortableColumn="name"]'));
      expect(sortableColumn).toBeTruthy();
    });

    it('should provide meaningful structure for screen readers', () => {
      const table = fixture.nativeElement.querySelector('p-table');
      expect(table).toBeTruthy();

      const headers = fixture.nativeElement.querySelectorAll('th');
      expect(headers.length).toBeGreaterThan(0);

      // Each header should have meaningful text
      const headerTexts = Array.from(headers as NodeListOf<Element>)
        .map((th) => th.textContent?.trim())
        .filter((text) => text && text.length > 0);

      expect(headerTexts.length).toBeGreaterThan(0);
    });
  });
});
