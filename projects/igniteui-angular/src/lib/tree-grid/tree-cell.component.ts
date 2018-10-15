import { Component, forwardRef, Input, HostBinding } from '@angular/core';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxRowComponent } from '../grid-common/row.component';
import { IFlattenedRecord } from './tree-grid.pipes';
import { IgxGridCellComponent } from '../grid-common/cell.component';
import { IgxTreeGridRowComponent } from './tree-grid-row.component';
import { IgxTreeGridAPIService } from './tree-grid-api.service';

@Component({
    selector: 'igx-tree-grid-cell',
    templateUrl: 'tree-cell.component.html'
})
export class IgxTreeGridCellComponent extends IgxGridCellComponent {
    public get indentation() {
        return this.row.indentation;
    }

    public get hasChildren() {
        return this.row.flatRow.hasChildren;
    }

    get expanded(): boolean {
        return this.row.expanded;
    }

    public toggle(event: Event) {
        event.stopPropagation();
        (<IgxTreeGridComponent>this.grid).toggleRowExpansion(this.row.flatRow);
    }

    public onFocus(event: Event) {
        event.stopPropagation();
    }
}
