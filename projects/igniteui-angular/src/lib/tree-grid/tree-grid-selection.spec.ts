import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SortingDirection } from '../data-operations/sorting-expression.interface';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxTreeGridModule } from './index';
import { IgxTreeGridSimpleComponent } from '../test-utils/tree-grid-components.spec';
import { TreeGridFunctions } from '../test-utils/tree-grid-functions.spec';

describe('IgxTreeGrid - Selection', () => {
    let fix;
    let treeGrid: IgxTreeGridComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTreeGridSimpleComponent
            ],
            imports: [IgxTreeGridModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
        fix.detectChanges();

        treeGrid = fix.componentInstance.treeGrid;
        treeGrid.rowSelectable = true;
        treeGrid.primaryKey = 'ID';
        fix.detectChanges();
    });

    describe('API Row Selection', () => {
        it('should be able to select/deselect all rows', () => {
            treeGrid.selectAllRows();
            fix.detectChanges();

            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);

            treeGrid.deselectAllRows();
            fix.detectChanges();

            TreeGridFunctions.verifyAllRowsSelection(fix, [], true);
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], false);
        });

        it('should be able to select row of any level', () => {
            treeGrid.selectRows([treeGrid.getRowByIndex(0).rowID], true);
            fix.detectChanges();

            // Verify selection.
            TreeGridFunctions.verifyAllRowsSelection(fix, [0], true);

            treeGrid.selectRows([treeGrid.getRowByIndex(2).rowID], false);
            fix.detectChanges();

            // Verify new selection by keeping the old one.
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 2], true);

            treeGrid.selectRows([treeGrid.getRowByIndex(1).rowID, treeGrid.getRowByIndex(3).rowID, 
                                 treeGrid.getRowByIndex(6).rowID, treeGrid.getRowByIndex(8).rowID], true);
            fix.detectChanges();

            // Verify new selection by NOT keeping the old one.
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 2], false);
            TreeGridFunctions.verifyAllRowsSelection(fix, [1, 3, 6, 8], true);
        });

        it('should be able to deselect row of any level', () => {
            treeGrid.selectRows([treeGrid.getRowByIndex(1).rowID, treeGrid.getRowByIndex(3).rowID,
                                 treeGrid.getRowByIndex(6).rowID, treeGrid.getRowByIndex(8).rowID,
                                 treeGrid.getRowByIndex(9).rowID], true);
            fix.detectChanges();

            treeGrid.deselectRows([treeGrid.getRowByIndex(1).rowID, treeGrid.getRowByIndex(3).rowID]);
            fix.detectChanges();

            // Verify modified selection
            TreeGridFunctions.verifyAllRowsSelection(fix, [1, 3], false);
            TreeGridFunctions.verifyAllRowsSelection(fix, [6, 8, 9], true);
        });
    });

    describe('UI Row Selection', () => {
        it('should be able to select/deselect all rows', () => {
            TreeGridFunctions.clickHeaderRowSelectionCheckbox(fix);
            fix.detectChanges();

            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);

            TreeGridFunctions.clickHeaderRowSelectionCheckbox(fix);
            fix.detectChanges();

            TreeGridFunctions.verifyAllRowsSelection(fix, [], true);
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], false);            
        });

        it('should be able to select row of any level', () => {
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 0);
            fix.detectChanges();
            TreeGridFunctions.verifyAllRowsSelection(fix, [0], true);
            
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 2);
            fix.detectChanges();
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 2], true);

            // Deselect rows
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 0);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 2);
            fix.detectChanges();

            // Select new rows
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 1);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 3);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 6);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 8);
            fix.detectChanges();

            // Verify new selection
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 2], false);
            TreeGridFunctions.verifyAllRowsSelection(fix, [1, 3, 6, 8], true);
        });

        it('should be able to deselect row of any level', () => {
            // Select rows
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 1);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 3);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 6);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 8);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 9);
            fix.detectChanges();

            // Deselect rows
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 1);
            TreeGridFunctions.clickRowSelectionCheckbox(fix, 3);
            fix.detectChanges();

            // Verify modified selection
            TreeGridFunctions.verifyAllRowsSelection(fix, [1, 3], false);
            TreeGridFunctions.verifyAllRowsSelection(fix, [6, 8, 9], true);
        });
    });
});
