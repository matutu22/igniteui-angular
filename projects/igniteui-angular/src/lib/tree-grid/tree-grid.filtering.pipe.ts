import { Pipe, PipeTransform } from '@angular/core';
import { cloneArray } from '../core/utils';
import { DataUtil } from '../data-operations/data-util';
import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { GridBaseAPIService } from '../grid-common/api.service';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IFilteringExpressionsTree } from '../data-operations/filtering-expressions-tree';
import { IHierarchicalRecord, IHierarchizedResult } from './tree-grid.pipes';
import { BaseFilteringStrategy } from '../data-operations/filtering-strategy';
import { IFilteringState } from '../data-operations/filtering-state.interface';

export class TreeGridFilteringStrategy extends BaseFilteringStrategy {
    public filter(data: IHierarchicalRecord[], expressionsTree: IFilteringExpressionsTree): IHierarchicalRecord[] {
        let i;
        let rec: IHierarchicalRecord;
        const len = data.length;
        const res: IHierarchicalRecord[] = [];
        if (!expressionsTree || !expressionsTree.filteringOperands || expressionsTree.filteringOperands.length === 0 || !len) {
            return data;
        }
        for (i = 0; i < len; i++) {
            rec = data[i];

            if (rec.children) {
                const filteredChildren = this.filter(rec.children, expressionsTree);
                rec.children = filteredChildren.length > 0 ? filteredChildren : null;
            }

            if (this.matchRecord(rec, expressionsTree)) {
                res.push(rec);
            } else if (rec.children && rec.children.length > 0) {
                rec.isFilteredOutParent = true;
                res.push(rec);
            }
        }
        return res;
    }

    protected getFieldValue(rec: object, fieldName: string): any {
        const hierarchicalRecord = <IHierarchicalRecord>rec;
        return hierarchicalRecord.data[fieldName];
    }
}

@Pipe({
    name: 'treeGridFiltering',
    pure: true
})
export class IgxTreeGridFilteringPipe implements PipeTransform {

    constructor(private gridAPI: GridBaseAPIService<IGridBaseComponent>) { }

    public transform(hierarchyData: IHierarchizedResult, expressionsTree: IFilteringExpressionsTree,
        id: string, pipeTrigger: number): IHierarchizedResult {
        const state = { expressionsTree: expressionsTree };

        if (!state.expressionsTree ||
            !state.expressionsTree.filteringOperands ||
            state.expressionsTree.filteringOperands.length === 0) {
            return hierarchyData;
        }

        DataUtil.mergeDefaultProperties(state, { strategy: new TreeGridFilteringStrategy() });

        const result = this.filter(hierarchyData.data, state);
        // grid.filteredData = result;
        return { data: result };
    }

    public filter(data: IHierarchicalRecord[], state: IFilteringState): IHierarchicalRecord[] {
        return state.strategy.filter(data, state.expressionsTree);
    }
}
