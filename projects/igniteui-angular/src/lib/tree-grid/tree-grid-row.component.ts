import { Component, forwardRef, Input, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxRowComponent } from '../grid-common/row.component';
import { IFlattenedRecord } from './tree-grid.pipes';
import { IgxTreeGridCellComponent } from './tree-cell.component';
import { IgxGridCellComponent } from '../grid-common';

@Component({
    selector: 'igx-tree-grid-row',
    templateUrl: 'tree-grid-row.component.html',
    providers: [{provide: IgxRowComponent, useExisting: forwardRef(() => IgxTreeGridRowComponent)}]
})
export class IgxTreeGridRowComponent extends IgxRowComponent<IgxTreeGridComponent> {
    private _flatRow: IFlattenedRecord;

    /**
     * The rendered cells in the row component.
     *
     * ```typescript
     * // get the cells of the third selected row
     * let selectedRowCells = this.grid.selectedRows[2].cells;
     * ```
     */
    @ViewChildren('treeCell')
    public cells: QueryList<any>;

    /**
     *  The flat data tow passed to the tree grid row component.
     *
     * ```typescript
     * ```
     */
    @Input()
    public get flatRow(): IFlattenedRecord {
        return this._flatRow;
    }
    public set flatRow(value: IFlattenedRecord) {
        if (this._flatRow !== value) {
            this._flatRow = value;
            this.rowData = this._flatRow.data;
        }
    }

    /**
    * @hidden
    */
    public getContext(col): any {
        return {
           $implicit: col,
           templateID: col.index === 0 ? 'treeCell' : 'cell'
        };
   }

    // public get indentation() {
    //     return this._flatRow.indentationLevel;
    // }
}
