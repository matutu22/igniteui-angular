import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SortingDirection } from '../data-operations/sorting-expression.interface';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxTreeGridModule } from './index';
import { IgxTreeGridSimpleComponent } from '../test-utils/tree-grid-components.spec';
import { IgxNumberFilteringOperand } from '../data-operations/filtering-condition';

// CSS class should end with a number that specified the row's level
const TREE_CELL_DIV_INDENTATION_CSS_CLASS = '.igx-grid__group-row--padding-level-';

fdescribe('IgxTreeGrid - Indentation', () => {
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
    });

    it('should have the tree-cell as a first cell on every row', () => {
        // Verify all rows are present
        const rows = getAllRows(fix);
        expect(rows.length).toBe(10);

        // Verify the tree cell is the first cell for every row
        verifyCellsPosition(rows, 4);
    });

    it('should have correct indentation for every record of each level', () => {
        const rows = sortElementsVertically(getAllRows(fix));
        verifyRowIndentationLevel(rows[0], 0);
        verifyRowIndentationLevel(rows[1], 1);
        verifyRowIndentationLevel(rows[2], 1);
        verifyRowIndentationLevel(rows[3], 1);
        verifyRowIndentationLevel(rows[4], 2);
        verifyRowIndentationLevel(rows[5], 2);
        verifyRowIndentationLevel(rows[6], 2);
        verifyRowIndentationLevel(rows[7], 0);
        verifyRowIndentationLevel(rows[8], 0);
        verifyRowIndentationLevel(rows[9], 1);
    });

    it('should persist the indentation after sorting', () => {
        treeGrid.columnList.filter(c => c.field === 'Age')[0].sortable = true;
        fix.detectChanges();
        treeGrid.sort({ fieldName: 'Age', dir: SortingDirection.Asc });
        fix.detectChanges();

        const rows = sortElementsVertically(getAllRows(fix));
        verifyRowIndentationLevel(rows[0], 0);
        verifyRowIndentationLevel(rows[1], 1);
        verifyRowIndentationLevel(rows[2], 0);
        verifyRowIndentationLevel(rows[3], 1);
        verifyRowIndentationLevel(rows[4], 1);
        verifyRowIndentationLevel(rows[5], 1);
        verifyRowIndentationLevel(rows[6], 2);
        verifyRowIndentationLevel(rows[7], 2);
        verifyRowIndentationLevel(rows[8], 2);
        verifyRowIndentationLevel(rows[9], 0);
    });

    it('should persist the indentation after filtering', () => {
        treeGrid.columnList.filter(c => c.field === 'Age')[0].sortable = true;
        fix.detectChanges();

        treeGrid.filter('Age', 40, IgxNumberFilteringOperand.instance().condition('greaterThan'));
        fix.detectChanges();

        const rows = sortElementsVertically(getAllRows(fix));
        verifyRowIndentationLevel(rows[0], 0);

        // This row does not satisfy the filtering, but is present in the DOM with lowered opacity
        // in order to indicate that it is a parent of another record that satisfies the filtering.
        verifyRowIndentationLevel(rows[1], 1);

        verifyRowIndentationLevel(rows[2], 2);
        verifyRowIndentationLevel(rows[3], 0);
        verifyRowIndentationLevel(rows[4], 0);
    });

    it('should persist the indentation on all pages when using paging', () => {
        treeGrid.paging = true;
        fix.detectChanges();
        treeGrid.perPage = 4;
        fix.detectChanges();

        // Verify page 1
        let rows = sortElementsVertically(getAllRows(fix));
        expect(rows.length).toBe(4, 'Incorrect number of rows on page 1.');
        verifyRowIndentationLevel(rows[0], 0);
        verifyRowIndentationLevel(rows[1], 1);
        verifyRowIndentationLevel(rows[2], 1);
        verifyRowIndentationLevel(rows[3], 1);

        treeGrid.page = 1;
        fix.detectChanges();

        // Verify page 2
        rows = sortElementsVertically(getAllRows(fix));
        expect(rows.length).toBe(4, 'Incorrect number of rows on page 2.');
        verifyRowIndentationLevel(rows[0], 2);
        verifyRowIndentationLevel(rows[1], 2);
        verifyRowIndentationLevel(rows[2], 2);
        verifyRowIndentationLevel(rows[3], 0);

        treeGrid.page = 2;
        fix.detectChanges();

        // Verify page 3
        rows = sortElementsVertically(getAllRows(fix));
        expect(rows.length).toBe(2, 'Incorrect number of rows on page 3.');
        verifyRowIndentationLevel(rows[0], 0);
        verifyRowIndentationLevel(rows[1], 1);
    });
});

function getAllRows(fix) {
    return fix.debugElement.queryAll(By.css('igx-tree-grid-row'));
}

function getTreeCell(row) {
    return row.query(By.css('igx-tree-grid-cell'));
}

function getNormalCells(row) {
    return row.queryAll(By.css('igx-grid-cell'));
}

function verifyCellsPosition(rows, expectedColumnsCount) {
    rows.forEach((row) => {
        // Verify each row's cell count
        const treeCell = getTreeCell(row);
        const normalCells = getNormalCells(row);
        expect(1 + normalCells.length).toBe(expectedColumnsCount);

        const treeCellRectRight = (<HTMLElement>treeCell.nativeElement).getBoundingClientRect().right;
        normalCells.forEach((normalCell) => {
            // Verify that the treeCell is the first cell (on the left of all the other cells)
            const normalCellRectLeft = (<HTMLElement>normalCell.nativeElement).getBoundingClientRect().left;
            expect(treeCellRectRight <= normalCellRectLeft).toBe(true, 'TreeCell is not on the left of all other cells.');
        });
    });
}

function verifyRowIndentationLevel(row, expectedIndentationLevel) {
    const treeCell = getTreeCell(row);
    const divChildren = treeCell.queryAll(By.css('div'));

    // If 'expectedIndentationLevel' is 0, we expect the row to be a root level row
    // and thus it has no indentation div.
    if (expectedIndentationLevel === 0) {
        expect(divChildren.length).toBe(2, 'root treeCell has incorrect divs count');
    } else {
        expect(divChildren.length).toBe(3, 'child treeCell has incorrect divs count');
        const indentationDiv = treeCell.query(By.css(TREE_CELL_DIV_INDENTATION_CSS_CLASS + expectedIndentationLevel));
        expect(indentationDiv).toBeDefined();
        expect(indentationDiv).not.toBeNull();
    }
}

function sortElementsVertically(arr) {
    return arr.sort((a, b) =>
        (<HTMLElement>a.nativeElement).getBoundingClientRect().top - (<HTMLElement>b.nativeElement).getBoundingClientRect().top);
}
