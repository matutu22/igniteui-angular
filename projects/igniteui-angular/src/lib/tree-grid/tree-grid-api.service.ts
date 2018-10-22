import { GridBaseAPIService } from '../grid-common/api.service';
import { IgxTreeGridComponent } from './tree-grid.component';

import { cloneArray } from '../core/utils';
import { DataUtil, DataType } from '../data-operations/data-util';
import { ISortingExpression, SortingDirection } from '../data-operations/sorting-expression.interface';
import { ITreeGridRecord } from './tree-grid.interfaces';
import { IgxTreeGridRowComponent } from './tree-grid-row.component';
import { ITreeGridRowExpansionEventArgs } from './tree-grid.interfaces';
import { IgxExpansionPanelDescriptionDirective } from '../expansion-panel/expansion-panel.directives';
import { IgxColumnComponent } from '../grid-common/column.component';

export class IgxTreeGridAPIService extends GridBaseAPIService<IgxTreeGridComponent> {
    public on_after_content_init(id: string) {
        // const grid = this.get(id);
        // if (grid.groupTemplate) {
        //     grid.groupRowTemplate = grid.groupTemplate.template;
        // }

        super.on_after_content_init(id);
    }

    public get_all_data(id: string): any[] {
        const grid = this.get(id);
        return grid.flatData;
    }

    public expand_row(id: string, rowID: any) {
        const grid = this.get(id);
        const expandedStates = grid.expandedStates;
        expandedStates.set(rowID, true);
        grid.expandedStates = expandedStates;
    }

    public collapse_row(id: string, rowID: any) {
        const grid = this.get(id);
        const expandedStates = grid.expandedStates;
        expandedStates.set(rowID, false);
        grid.expandedStates = expandedStates;
    }

    public toggle_row_expansion(id: string, rowID: any) {
        const grid = this.get(id);
        const expandedStates = grid.expandedStates;
        const treeRecord = grid.treeGridRecordsMap.get(rowID);

        if (treeRecord) {
            const isExpanded = this.get_row_expansion_state(id, rowID, treeRecord.indentationLevel);
            expandedStates.set(rowID, !isExpanded);
            grid.expandedStates = expandedStates;
        }
    }

    public trigger_row_expansion_toggle(id: string, row: IgxTreeGridRowComponent, event: Event) {
        const grid = this.get(id);
        const expanded = !row.treeRow.expanded;

        const args: ITreeGridRowExpansionEventArgs = {
            row: row,
            expanded: expanded,
            event: event,
            cancel: false
        };
        grid.onRowExpansionToggle.emit(args);

        if (args.cancel) {
            return;
        }

        const expandedStates = grid.expandedStates;
        expandedStates.set(row.rowID, expanded);
        grid.expandedStates = expandedStates;
    }

    public get_row_expansion_state(id: string, rowID: any, indentationLevel: number): boolean {
        const grid = this.get(id);
        const states = grid.expandedStates;
        const expanded = states.get(rowID);

        if (expanded !== undefined) {
            return expanded;
        } else {
            return indentationLevel < grid.expandedLevels;
        }
    }

    public add_child_row(id: string, parentRowID: any, data: any) {
        const grid = this.get(id);
        const parentRecord = grid.treeGridRecordsMap.get(parentRowID);

        if (!parentRecord) {
            return;
        }

        if (grid.primaryKey && grid.foreignKey) {
            data[grid.foreignKey] = parentRowID;
            this.add_row(id, data);
        } else {
            const children = parentRecord.data[grid.childDataKey];
            children.push(data);
            this.trigger_row_added(id, data);
        }
    }

    protected delete_row_from_array(id: string, rowID: any, index: number) {
        const grid = this.get(id);
        if (grid.primaryKey && grid.foreignKey) {
            super.delete_row_from_array(id, rowID, index);
        } else {
            const record = grid.treeGridRecordsMap.get(rowID);
            const childData = record.parent.data[grid.childDataKey];
            index = grid.primaryKey ? childData.map(c => c[grid.primaryKey]).indexOf(rowID) :
                childData.indexOf(rowID);
            childData.splice(index, 1);
        }
    }

    protected update_row_in_array(id: string, value: any, rowID: any, index: number) {
        const grid = this.get(id);
        if (grid.primaryKey && grid.foreignKey) {
            super.update_row_in_array(id, value, rowID, index);
        } else {
            const record = grid.treeGridRecordsMap.get(rowID);
            const childData = record.parent.data[grid.childDataKey];
            index = grid.primaryKey ? childData.map(c => c[grid.primaryKey]).indexOf(rowID) :
                childData.indexOf(rowID);
            childData[index] = value;
        }
    }

    public should_apply_number_style(column: IgxColumnComponent): boolean {
        return column.dataType === DataType.Number && column.visibleIndex !== 0;
    }
}
