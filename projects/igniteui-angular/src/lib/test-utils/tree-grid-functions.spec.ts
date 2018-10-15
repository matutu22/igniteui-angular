import { By } from '@angular/platform-browser';

// CSS class should end with a number that specified the row's level
const TREE_CELL_DIV_INDENTATION_CSS_CLASS = '.igx-grid__group-row--padding-level-';

export class TreeGridFunctions {
    public static getAllRows(fix) {
        return fix.debugElement.queryAll(By.css('igx-tree-grid-row'));
    }
    
    public static getTreeCell(row) {
        return row.query(By.css('igx-tree-grid-cell'));
    }
    
    public static getTreeCells(fix) {
        return fix.debugElement.queryAll(By.css('igx-tree-grid-cell'));
    }
    
    public static getNormalCells(row) {
        return row.queryAll(By.css('igx-grid-cell'));
    }
    
    public static getHeaderCell(fix, columnKey) {
        const headerCells = fix.debugElement.queryAll(By.css('igx-grid-header'));
        const headerCell = headerCells.filter((cell) => cell.nativeElement.textContent.indexOf(columnKey) !== -1)[0];
        return headerCell;
    }

    public static clickHeaderCell(fix, columnKey) {
        const cell = TreeGridFunctions.getHeaderCell(fix, columnKey);
        cell.nativeElement.dispatchEvent(new Event('click'));
    }

    public static verifyCellsPosition(rows, expectedColumnsCount) {
        rows.forEach((row) => {
            // Verify each row's cell count
            const treeCell = TreeGridFunctions.getTreeCell(row);
            const normalCells = TreeGridFunctions.getNormalCells(row);
            expect(1 + normalCells.length).toBe(expectedColumnsCount, 'incorrect cell count for a row');
    
            const treeCellRectRight = (<HTMLElement>treeCell.nativeElement).getBoundingClientRect().right;
            normalCells.forEach((normalCell) => {
                // Verify that the treeCell is the first cell (on the left of all the other cells)
                const normalCellRectLeft = (<HTMLElement>normalCell.nativeElement).getBoundingClientRect().left;
                expect(treeCellRectRight <= normalCellRectLeft).toBe(true, 'TreeCell is not on the left of a normal cell.');
            });
        });
    }
    
    public static verifyRowIndentationLevel(rowComponent, rowDOM, expectedIndentationLevel) {
        const treeCell = TreeGridFunctions.getTreeCell(rowDOM);
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
    
    public static verifyTreeColumn(fix, expectedTreeColumnKey, expectedColumnsCount) {
        const headerCell = TreeGridFunctions.getHeaderCell(fix, expectedTreeColumnKey);
        const treeCells = TreeGridFunctions.getTreeCells(fix);
        const rows = TreeGridFunctions.getAllRows(fix);
    
        // Verify the tree cells are first (on the left) in comparison to the rest of the cells.
        TreeGridFunctions.verifyCellsPosition(rows, expectedColumnsCount);
    
        // Verify the tree cells are exactly under the respective header cell.
        const headerCellRect = (<HTMLElement>headerCell.nativeElement).getBoundingClientRect();
        treeCells.forEach(treeCell => {
            const treeCellRect = (<HTMLElement>treeCell.nativeElement).getBoundingClientRect();
            expect(headerCellRect.bottom <= treeCellRect.top).toBe(true, 'headerCell is not on top of a treeCell');
            expect(headerCellRect.left).toBe(treeCellRect.left, 'headerCell and treeCell are not left-aligned');
            expect(headerCellRect.right).toBe(treeCellRect.right, 'headerCell and treeCell are not right-aligned');
        });
    }
    
    public static sortElementsVertically(arr) {
        return arr.sort((a, b) =>
            (<HTMLElement>a.nativeElement).getBoundingClientRect().top - (<HTMLElement>b.nativeElement).getBoundingClientRect().top);
    }
}
