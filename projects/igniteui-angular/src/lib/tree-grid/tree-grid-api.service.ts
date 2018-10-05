import { GridBaseAPIService } from '../grid-common/api.service';
import { IgxTreeGridComponent } from './tree-grid.component';

import { cloneArray } from '../core/utils';
import { DataUtil } from '../data-operations/data-util';
import { ISortingExpression, SortingDirection } from '../data-operations/sorting-expression.interface';
import { IFlattenedRecord } from './tree-grid.pipes';

export class IgxTreeGridAPIService extends GridBaseAPIService<IgxTreeGridComponent> {
    public on_after_content_init(id: string) {
        // const grid = this.get(id);
        // if (grid.groupTemplate) {
        //     grid.groupRowTemplate = grid.groupTemplate.template;
        // }

        super.on_after_content_init(id);
    }

    public toggle_row_expansion(id: string, row: IFlattenedRecord) {
        const grid = this.get(id);
        const expandedStates = grid.expandedStates;
        const expanded = this.get_row_expansion_state(id, row);
        const rowID = this.get_row_id(id, row);
        expandedStates.set(rowID, !expanded);

        grid.expandedStates = expandedStates;
    }

    public get_row_expansion_state(id: string, row: IFlattenedRecord): boolean {
        const grid = this.get(id);
        const states = grid.expandedStates;
        const rowID = this.get_row_id(id, row);
        const expanded = states.get(rowID);

        if (expanded !== undefined) {
            return expanded;
        } else {
            return this.get_default_row_expansion_state(id, row);
        }
    }

    public get_row_id(id: string, row: IFlattenedRecord) {
        const grid = this.get(id);
        const primaryKey = grid.primaryKey;
        return primaryKey ? row.data[primaryKey] : row.data;
    }

    public get_default_row_expansion_state(id: string, row: IFlattenedRecord): boolean {
        const grid = this.get(id);
        const indentationLevel = row.indentationLevel;
        const expandedLevels = grid.expandedLevels;

        return indentationLevel < expandedLevels;
    }
}
