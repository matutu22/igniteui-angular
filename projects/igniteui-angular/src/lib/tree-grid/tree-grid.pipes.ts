import { Pipe, PipeTransform } from '@angular/core';
import { cloneArray } from '../core/utils';
import { DataUtil } from '../data-operations/data-util';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { GridBaseAPIService } from '../grid-common/api.service';
import { IgxTreeGridComponent } from './tree-grid.component';
import { ISortingExpression } from '../../public_api';

export interface IHierarchicalRecord {
    data: any;
    children: IHierarchicalRecord[];
    isFilteredOutParent?: boolean;
}

export interface IHierarchizedResult {
    data: IHierarchicalRecord[];
}

export interface IFlattenedRecord {
    data: any;
    hasChildren: boolean;
    indentationLevel: number;
    isFilteredOutParent?: boolean;
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
        id: string, pipeTrigger: number): IHierarchizedResult {
        let hirerchicalRecords: IHierarchicalRecord[] = [];
        if (primaryKey && foreignKey) {
            hirerchicalRecords = this.hierarchizeFlatData(collection, primaryKey, foreignKey);
        } else if (childDataKey) {
            hirerchicalRecords = this.hierarchizeRecursive(collection, childDataKey);
        }

        return {
            data: hirerchicalRecords
        };
    }

    private hierarchizeFlatData(collection: any[], primaryKey: string, foreignKey: string): IHierarchicalRecord[] {
        const map: Map<any, IHierarchicalRecord> = new Map<any, IHierarchicalRecord>();
        const result: IHierarchicalRecord[] = [];
        const missingParentRecords: IHierarchicalRecord[] = [];
        collection.forEach(row => {
            const record: IHierarchicalRecord = {
                data: row,
                children: []
            };
            const parent = map.get(row[foreignKey]);
            if (parent) {
                parent.children.push(record);
            } else {
                missingParentRecords.push(record);
            }

            map.set(row[primaryKey], record);
        });

        missingParentRecords.forEach(record => {
            const parent = map.get(record.data[foreignKey]);
            if (parent) {
                parent.children.push(record);
            } else {
                result.push(record);
            }
        });

        return result;
    }

    private hierarchizeRecursive(collection: any[], childDataKey: string): IHierarchicalRecord[] {
        const result: IHierarchicalRecord[] = [];

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            result.push({
                data: item,
                children: item[childDataKey] ? this.hierarchizeRecursive(item[childDataKey], childDataKey) : null
            });
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

    public transform(collection: IHierarchizedResult, id: string,
        expandedLevels: number, expandedStates: Map<any, boolean>, pipeTrigger: number): any[] {

        const grid: IgxTreeGridComponent = this.gridAPI.get(id);
        const data: IFlattenedRecord[] = [];

        this.getFlatDataRecusrive(collection.data, data, expandedLevels, expandedStates, id, 0);

        if (this.hasFiltering(grid) && data.length > 0) {
            grid.filteredData = data.filter(r => !r.isFilteredOutParent).map(r => r.data);
        }

        return data;
    }

    private hasFiltering(grid: IgxTreeGridComponent): boolean {
        return grid.filteringExpressionsTree && grid.filteringExpressionsTree.filteringOperands &&
            grid.filteringExpressionsTree.filteringOperands.length > 0;
    }

    private getFlatDataRecusrive(collection: IHierarchicalRecord[], data: IFlattenedRecord[] = [],
        expandedLevels: number, expandedStates: Map<any, boolean>, gridID: string, indentationLevel: number) {
        if (!collection || !collection.length) {
            return;
        }

        for (let i = 0; i < collection.length; i++) {
            const hirarchicalRecord = collection[i];
            const flatRecord: IFlattenedRecord = {
                data: hirarchicalRecord.data,
                indentationLevel: indentationLevel,
                hasChildren: hirarchicalRecord.children && hirarchicalRecord.children.length > 0,
                isFilteredOutParent: hirarchicalRecord.isFilteredOutParent
            };
            data.push(flatRecord);

            let isExpanded = this.gridAPI.get_row_expansion_state(gridID, flatRecord);
            const grid: IgxTreeGridComponent = this.gridAPI.get(gridID);

            if (flatRecord.hasChildren && !isExpanded && this.hasFiltering(grid)) {
                const rowID = this.gridAPI.get_row_id(gridID, flatRecord);
                grid.expandedStates.set(rowID, true);
                isExpanded = true;
            }

            if (isExpanded) {
                this.getFlatDataRecusrive(hirarchicalRecord.children, data, expandedLevels,
                    expandedStates, gridID, indentationLevel + 1);
            }
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
        hierarchicalData: IHierarchizedResult,
        expressions: ISortingExpression | ISortingExpression[],
        id: string,
        pipeTrigger: number): IHierarchizedResult {
            const state = { expressions: [] };
            const grid = this.gridAPI.get(id);
            state.expressions = grid.sortingExpressions;

            let result: IHierarchizedResult;
            if (!state.expressions.length) {
                result = hierarchicalData;
            } else {
                result = { data: DataUtil.hierarchicalSort(hierarchicalData.data, state)};
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

    public transform(collection: IFlattenedRecord[], page = 0, perPage = 15, id: string, pipeTrigger: number): IFlattenedRecord[] {
        if (!this.gridAPI.get(id).paging) {
            return collection;
        }

        const state = {
            index: page,
            recordsPerPage: perPage
        };

        const result: IFlattenedRecord[] = DataUtil.page(cloneArray(collection), state);

        this.gridAPI.get(id).pagingState = state;
        return result;
    }
}
