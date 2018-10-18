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
        it('should be able to select all', () => {
            treeGrid.selectAllRows();
            fix.detectChanges();

            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);
        });

        it('should be able to deselect all', () => {
            treeGrid.selectAllRows();
            fix.detectChanges();

            treeGrid.deselectAllRows();
            fix.detectChanges();

            TreeGridFunctions.verifyAllRowsSelection(fix, [], true);
        });

        it('should be able to select row of any level', () => {
            treeGrid.selectRows([147], true);
            fix.detectChanges();

            // Verify selection.
            TreeGridFunctions.verifyAllRowsSelection(fix, [0], true);

            treeGrid.selectRows([957], false);
            fix.detectChanges();

            // Verify new selection by keeping the old one.
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 2], true);

            treeGrid.selectRows([475, 317, 299, 847], true);
            fix.detectChanges();

            // Verify new selection by NOT keeping the old one.
            TreeGridFunctions.verifyAllRowsSelection(fix, [0, 2], false);
            TreeGridFunctions.verifyAllRowsSelection(fix, [1, 3, 6, 8], true);
        });

        it('should be able to deselect row of any level', () => {
            treeGrid.selectRows([475, 317, 299, 847, 663], true);
            fix.detectChanges();

            treeGrid.deselectRows([475, 317]);
            fix.detectChanges();

            // Verify modified selection
            TreeGridFunctions.verifyAllRowsSelection(fix, [1, 3], false);
            TreeGridFunctions.verifyAllRowsSelection(fix, [6, 8, 9], true);
        });
    });

    describe('UI Row Selection', () => {

    });
});
