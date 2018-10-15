import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SortingDirection } from '../data-operations/sorting-expression.interface';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxTreeGridModule } from './index';
import { IgxTreeGridSimpleComponent, IgxTreeGridPrimaryForeignKeyComponent } from '../test-utils/tree-grid-components.spec';
import { IgxNumberFilteringOperand } from '../data-operations/filtering-condition';

// CSS class should end with a number that specified the row's level
const TREE_CELL_DIV_INDENTATION_CSS_CLASS = '.igx-grid__group-row--padding-level-';

describe('IgxTreeGrid - Indentation', () => {
    let fix;
    let treeGrid: IgxTreeGridComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTreeGridSimpleComponent,
                IgxTreeGridPrimaryForeignKeyComponent
            ],
            imports: [IgxTreeGridModule]
        })
            .compileComponents();
    }));

    describe('Child Collection Indentation', () => {
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
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(4), rows[4], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(5), rows[5], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(6), rows[6], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(7), rows[7], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(8), rows[8], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(9), rows[9], 1);
        });

        it('should persist the indentation after sorting', () => {
            treeGrid.columnList.filter(c => c.field === 'Age')[0].sortable = true;
            fix.detectChanges();
            treeGrid.sort({ fieldName: 'Age', dir: SortingDirection.Asc });
            fix.detectChanges();

            const rows = sortElementsVertically(getAllRows(fix));
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(4), rows[4], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(5), rows[5], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(6), rows[6], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(7), rows[7], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(8), rows[8], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(9), rows[9], 0);
        });

        it('should persist the indentation after filtering', () => {
            treeGrid.columnList.filter(c => c.field === 'Age')[0].sortable = true;
            fix.detectChanges();

            treeGrid.filter('Age', 40, IgxNumberFilteringOperand.instance().condition('greaterThan'));
            fix.detectChanges();

            const rows = sortElementsVertically(getAllRows(fix));
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);

            // This row does not satisfy the filtering, but is present in the DOM with lowered opacity
            // in order to indicate that it is a parent of another record that satisfies the filtering.
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);

            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(4), rows[4], 0);
        });

        it('should persist the indentation on all pages when using paging', () => {
            treeGrid.paging = true;
            fix.detectChanges();
            treeGrid.perPage = 4;
            fix.detectChanges();

            // Verify page 1
            let rows = sortElementsVertically(getAllRows(fix));
            expect(rows.length).toBe(4, 'Incorrect number of rows on page 1.');
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 1);

            treeGrid.page = 1;
            fix.detectChanges();

            // Verify page 2
            rows = sortElementsVertically(getAllRows(fix));
            expect(rows.length).toBe(4, 'Incorrect number of rows on page 2.');
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 0);

            treeGrid.page = 2;
            fix.detectChanges();

            // Verify page 3
            rows = sortElementsVertically(getAllRows(fix));
            expect(rows.length).toBe(2, 'Incorrect number of rows on page 3.');
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
        });

        it('should transform a non-tree column into a tree column when pinning it', () => {
            verifyTreeColumn(fix, 'ID', 4);

            treeGrid.pinColumn('Age');
            fix.detectChanges();

            verifyTreeColumn(fix, 'Age', 4);
        });
    });

    describe('Primary/Foreign key Relation Indentation', () => {
        beforeEach(() => {
            fix = TestBed.createComponent(IgxTreeGridPrimaryForeignKeyComponent);
            fix.detectChanges();
            treeGrid = fix.componentInstance.treeGrid;
        });

        it('should have the tree-cell as a first cell on every row with primary/foreign keys', () => {
            // Verify all rows are present
            const rows = getAllRows(fix);
            expect(rows.length).toBe(8);

            // Verify the tree cell is the first cell for every row
            verifyCellsPosition(rows, 5);
        });

        it('should have correct indentation for every record of each level with primary/foreign keys', () => {
            const rows = sortElementsVertically(getAllRows(fix));
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(4), rows[4], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(5), rows[5], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(6), rows[6], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(7), rows[7], 1);
        });

        it('should persist the indentation after sorting with primary/foreign keys', () => {
            treeGrid.columnList.filter(c => c.field === 'Age')[0].sortable = true;
            fix.detectChanges();
            treeGrid.sort({ fieldName: 'Age', dir: SortingDirection.Asc });
            fix.detectChanges();

            const rows = sortElementsVertically(getAllRows(fix));
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(4), rows[4], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(5), rows[5], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(6), rows[6], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(7), rows[7], 1);
        });

        it('should persist the indentation after filtering with primary/foreign keys', () => {
            treeGrid.columnList.filter(c => c.field === 'Age')[0].sortable = true;
            fix.detectChanges();

            treeGrid.filter('Age', 35, IgxNumberFilteringOperand.instance().condition('greaterThan'));
            fix.detectChanges();

            const rows = sortElementsVertically(getAllRows(fix));

            // This row does not satisfy the filtering, but is present in the DOM with lowered opacity
            // in order to indicate that it is a parent of another record that satisfies the filtering.
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);

            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(3), rows[3], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(4), rows[4], 1);
        });

        it('should persist the indentation on all pages when using paging with primary/foreign keys', () => {
            treeGrid.paging = true;
            fix.detectChanges();
            treeGrid.perPage = 3;
            fix.detectChanges();

            // Verify page 1
            let rows = sortElementsVertically(getAllRows(fix));
            expect(rows.length).toBe(3, 'Incorrect number of rows on page 1.');
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 2);

            treeGrid.page = 1;
            fix.detectChanges();

            // Verify page 2
            rows = sortElementsVertically(getAllRows(fix));
            expect(rows.length).toBe(3, 'Incorrect number of rows on page 2.');
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 2);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(2), rows[2], 0);

            treeGrid.page = 2;
            fix.detectChanges();

            // Verify page 3
            rows = sortElementsVertically(getAllRows(fix));
            expect(rows.length).toBe(2, 'Incorrect number of rows on page 3.');
            verifyRowIndentationLevel(treeGrid.getRowByIndex(0), rows[0], 0);
            verifyRowIndentationLevel(treeGrid.getRowByIndex(1), rows[1], 1);
        });

        it('should transform a non-tree column into a tree column when pinning it with primary/foreign keys', () => {
            verifyTreeColumn(fix, 'ID', 5);

            treeGrid.pinColumn('Name');
            fix.detectChanges();

            verifyTreeColumn(fix, 'Name', 5);
        });
    });
});

function getAllRows(fix) {
    return fix.debugElement.queryAll(By.css('igx-tree-grid-row'));
}

function getTreeCell(row) {
    return row.query(By.css('igx-tree-grid-cell'));
}

function getTreeCells(fix) {
    return fix.debugElement.queryAll(By.css('igx-tree-grid-cell'));
}

function getNormalCells(row) {
    return row.queryAll(By.css('igx-grid-cell'));
}

function getHeaderCell(fix, columnKey) {
    const headerCells = fix.debugElement.queryAll(By.css('igx-grid-header'));
    const headerCell = headerCells.filter((cell) => cell.nativeElement.textContent.indexOf(columnKey) !== -1)[0];
    return headerCell;
}

function verifyCellsPosition(rows, expectedColumnsCount) {
    rows.forEach((row) => {
        // Verify each row's cell count
        const treeCell = getTreeCell(row);
        const normalCells = getNormalCells(row);
        expect(1 + normalCells.length).toBe(expectedColumnsCount, 'incorrect cell count for a row');

        const treeCellRectRight = (<HTMLElement>treeCell.nativeElement).getBoundingClientRect().right;
        normalCells.forEach((normalCell) => {
            // Verify that the treeCell is the first cell (on the left of all the other cells)
            const normalCellRectLeft = (<HTMLElement>normalCell.nativeElement).getBoundingClientRect().left;
            expect(treeCellRectRight <= normalCellRectLeft).toBe(true, 'TreeCell is not on the left of a normal cell.');
        });
    });
}

function verifyRowIndentationLevel(rowComponent, rowDOM, expectedIndentationLevel) {
    const treeCell = getTreeCell(rowDOM);
    const divChildren = treeCell.queryAll(By.css('div'));

    // If 'expectedIndentationLevel' is 0, we expect the row to be a root level row
    // and thus it has no indentation div.
    const indentationDiv = treeCell.query(By.css(TREE_CELL_DIV_INDENTATION_CSS_CLASS + expectedIndentationLevel));
    if (expectedIndentationLevel === 0) {
        expect(divChildren.length).toBe(2, 'root treeCell has incorrect divs count');
        expect(indentationDiv).toBeNull();
    } else {
        expect(divChildren.length).toBe(3, 'child treeCell has incorrect divs count');
        expect(indentationDiv).toBeDefined();
        expect(indentationDiv).not.toBeNull();
    }

    // Verify rowComponent's indentation API.
    expect(rowComponent.indentation).toBe(expectedIndentationLevel);
}

function verifyTreeColumn(fix, expectedTreeColumnKey, expectedColumnsCount) {
    const headerCell = getHeaderCell(fix, expectedTreeColumnKey);
    const treeCells = getTreeCells(fix);
    const rows = getAllRows(fix);

    // Verify the tree cells are first (on the left) in comparison to the rest of the cells.
    verifyCellsPosition(rows, expectedColumnsCount);

    // Verify the tree cells are exactly under the respective header cell.
    const headerCellRect = (<HTMLElement>headerCell.nativeElement).getBoundingClientRect();
    treeCells.forEach(treeCell => {
        const treeCellRect = (<HTMLElement>treeCell.nativeElement).getBoundingClientRect();
        expect(headerCellRect.bottom <= treeCellRect.top).toBe(true, 'headerCell is not on top of a treeCell');
        expect(headerCellRect.left).toBe(treeCellRect.left, 'headerCell and treeCell are not left-aligned');
        expect(headerCellRect.right).toBe(treeCellRect.right, 'headerCell and treeCell are not right-aligned');
    });
}

function sortElementsVertically(arr) {
    return arr.sort((a, b) =>
        (<HTMLElement>a.nativeElement).getBoundingClientRect().top - (<HTMLElement>b.nativeElement).getBoundingClientRect().top);
}
