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
        return this.row.flatRow.indentationLevel;
    }

    public get hasChildren() {
        return this.row.flatRow.hasChildren;
    }

    @HostBinding('attr.aria-expanded')
    get expanded(): boolean {
        const states = (<IgxTreeGridComponent>this.grid).expandedStates;
        const rowID = this.row.rowID;
        const expanded = states.get(rowID);

        if (expanded !== undefined) {
            return expanded;
        } else {
            return this.getDefaultExpandedState();
        }
    }

    private getDefaultExpandedState(): boolean {
        const indentationLevel = this.indentation;
        const expandedLevels = (<IgxTreeGridComponent>this.grid).expandedLevels;

        return indentationLevel < expandedLevels;
    }

    public toggle() {
        const states = (<IgxTreeGridComponent>this.grid).expandedStates;
        const rowID = this.row.rowID;
        states.set(rowID, !this.expanded);

        (<IgxTreeGridComponent>this.grid).expandedStates = states;
    }
}
