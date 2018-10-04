import { Component, forwardRef, Input, HostBinding } from '@angular/core';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxRowComponent } from '../grid-common/row.component';
import { IFlattenedRecord } from './tree-grid.pipes';
import { IgxGridCellComponent } from '../grid-common/cell.component';
import { IgxTreeGridRowComponent } from './tree-grid-row.component';

@Component({
    selector: 'igx-tree-grid-cell',
    templateUrl: 'tree-cell.component.html'
})
export class IgxTreeGridCellComponent extends IgxGridCellComponent {
    public get indentation() {
        const flatRowComponent = <IgxTreeGridRowComponent>this.row;
        return flatRowComponent.flatRow.indentationLevel;
    }

    public get hasChildren() {
        const flatRowComponent = <IgxTreeGridRowComponent>this.row;
        return flatRowComponent.flatRow.hasChildren;
    }

    @HostBinding('attr.aria-expanded')
    get expanded(): boolean {
        return true;
    }

    public toggle() {
    }
}
