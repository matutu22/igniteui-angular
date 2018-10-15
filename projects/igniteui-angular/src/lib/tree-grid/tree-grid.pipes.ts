import { Pipe, PipeTransform } from '@angular/core';
import { cloneArray } from '../core/utils';
import { DataUtil } from '../data-operations/data-util';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { GridBaseAPIService } from '../grid-common/api.service';
import { IgxTreeGridComponent } from './tree-grid.component';
import { ISortingExpression } from '../../public_api';

export interface ITreeGridRecord {
    rowID: any;
    data: any;
    children?: ITreeGridRecord[];
    parent?: ITreeGridRecord;
    isFilteredOutParent?: boolean;
    hasChildren?: boolean;
    indentationLevel?: number;
    expanded?: boolean;
}

/**
 *@hidden
 */
@Pipe({
    name: 'treeGridHierarchizing',
    pure: true
})
export class IgxTreeGridHierarchizingPipe implements PipeTransform {
    private gridAPI: IgxTreeGridAPIService;

    constructor(gridAPI: GridBaseAPIService<IGridBaseComponent>) {
        this.gridAPI = <IgxTreeGridAPIService>gridAPI;
    }

    public transform(collection: any[], primaryKey: string, foreignKey: string, childDataKey: string,
        id: string, pipeTrigger: number): ITreeGridRecord[] {
        let hirerchicalRecords: ITreeGridRecord[] = [];
        if (primaryKey && foreignKey) {
            hirerchicalRecords = this.hierarchizeFlatData(collection, primaryKey, foreignKey);
        } else if (childDataKey) {
            hirerchicalRecords = this.hierarchizeRecursive(collection, primaryKey, childDataKey, undefined);
        }

        return hirerchicalRecords;
    }

    private getRowID(primaryKey: any, rowData: any) {
        return primaryKey ? rowData[primaryKey] : rowData;
    }

    private hierarchizeFlatData(collection: any[], primaryKey: string, foreignKey: string): ITreeGridRecord[] {
        const map: Map<any, ITreeGridRecord> = new Map<any, ITreeGridRecord>();
        const result: ITreeGridRecord[] = [];
        const missingParentRecords: ITreeGridRecord[] = [];
        collection.forEach(row => {
            const record: ITreeGridRecord = {
                rowID: this.getRowID(primaryKey, row),
                data: row,
                children: []
            };
            const parent = map.get(row[foreignKey]);
            if (parent) {
                record.parent = parent;
                parent.children.push(record);
            } else {
                missingParentRecords.push(record);
            }

            map.set(row[primaryKey], record);
        });

        missingParentRecords.forEach(record => {
            const parent = map.get(record.data[foreignKey]);
            if (parent) {
                record.parent = parent;
                parent.children.push(record);
            } else {
                result.push(record);
            }
        });

        return result;
    }

    private hierarchizeRecursive(collection: any[], primaryKey: string, childDataKey: string, parent: ITreeGridRecord): ITreeGridRecord[] {
        const result: ITreeGridRecord[] = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            const record: ITreeGridRecord = {
                rowID: this.getRowID(primaryKey, item),
                data: item,
                parent: parent
            };
            record.children = item[childDataKey] ?
                this.hierarchizeRecursive(item[childDataKey], primaryKey, childDataKey, record) : undefined;
            result.push(record);
        }

        return result;
    }
}

/**
 *@hidden
 */
@Pipe({
    name: 'treeGridFlattening',
    pure: true
})
export class IgxTreeGridFlatteningPipe implements PipeTransform {
    private gridAPI: IgxTreeGridAPIService;

    constructor(gridAPI: GridBaseAPIService<IGridBaseComponent>) {
        this.gridAPI = <IgxTreeGridAPIService>gridAPI;
    }

    public transform(collection: ITreeGridRecord[], id: string,
        expandedLevels: number, expandedStates: Map<any, boolean>, pipeTrigger: number): any[] {

        const grid: IgxTreeGridComponent = this.gridAPI.get(id);
        const data: ITreeGridRecord[] = [];

        grid.treeGridRecords = collection;
        grid.treeGridRecordsMap = new Map<any, ITreeGridRecord>();

        this.getFlatDataRecusrive(collection, data, expandedLevels, expandedStates, id, undefined, 0);

        if (this.hasFiltering(grid) && data.length > 0) {
            grid.filteredData = data.filter(r => !r.isFilteredOutParent).map(r => r.data);
        }

        return data;
    }

    private hasFiltering(grid: IgxTreeGridComponent): boolean {
        return grid.filteringExpressionsTree && grid.filteringExpressionsTree.filteringOperands &&
            grid.filteringExpressionsTree.filteringOperands.length > 0;
    }

    private getFlatDataRecusrive(collection: ITreeGridRecord[], data: ITreeGridRecord[] = [],
        expandedLevels: number, expandedStates: Map<any, boolean>, gridID: string, parent: ITreeGridRecord, indentationLevel: number) {
        if (!collection || !collection.length) {
            return;
        }

        for (let i = 0; i < collection.length; i++) {
            const hierarchicalRecord = collection[i];
            hierarchicalRecord.indentationLevel = indentationLevel;
            hierarchicalRecord.hasChildren =  hierarchicalRecord.children && hierarchicalRecord.children.length > 0;

            if (!parent || parent.expanded) {
                data.push(hierarchicalRecord);
            }

            let isExpanded = this.gridAPI.get_row_expansion_state(gridID, hierarchicalRecord.rowID, hierarchicalRecord.indentationLevel);
            const grid: IgxTreeGridComponent = this.gridAPI.get(gridID);

            if (hierarchicalRecord.hasChildren && !isExpanded && this.hasFiltering(grid)) {
                grid.expandedStates.set(hierarchicalRecord.rowID, true);
                isExpanded = true;
            }

            hierarchicalRecord.expanded = isExpanded;

            grid.treeGridRecordsMap.set(hierarchicalRecord.rowID, hierarchicalRecord);

            this.getFlatDataRecusrive(hierarchicalRecord.children, data, expandedLevels,
                expandedStates, gridID, hierarchicalRecord, indentationLevel + 1);
        }
    }
}

@Pipe({
    name: 'treeGridSorting',
    pure: true
})
export class IgxTreeGridSortingPipe implements PipeTransform {
    private gridAPI: IgxTreeGridAPIService;

    constructor(gridAPI: GridBaseAPIService<IGridBaseComponent>) {
        this.gridAPI = <IgxTreeGridAPIService>gridAPI;
    }

    public transform(
        hierarchicalData: ITreeGridRecord[],
        expressions: ISortingExpression | ISortingExpression[],
        id: string,
        pipeTrigger: number): ITreeGridRecord[] {
            const state = { expressions: [] };
            const grid = this.gridAPI.get(id);
            state.expressions = grid.sortingExpressions;

            let result: ITreeGridRecord[];
            if (!state.expressions.length) {
                result = hierarchicalData;
            } else {
                result = DataUtil.hierarchicalSort(hierarchicalData, state, undefined);
            }

            return result;
    }
}

@Pipe({
    name: 'treeGridPaging',
    pure: true
})
export class IgxTreeGridPagingPipe implements PipeTransform {
    private gridAPI: IgxTreeGridAPIService;

    constructor(gridAPI: GridBaseAPIService<IGridBaseComponent>) {
        this.gridAPI = <IgxTreeGridAPIService>gridAPI;
    }

    public transform(collection: ITreeGridRecord[], page = 0, perPage = 15, id: string, pipeTrigger: number): ITreeGridRecord[] {
        if (!this.gridAPI.get(id).paging) {
            return collection;
        }

        const state = {
            index: page,
            recordsPerPage: perPage
        };

        const result: ITreeGridRecord[] = DataUtil.page(cloneArray(collection), state);

        this.gridAPI.get(id).pagingState = state;
        return result;
    }
}
