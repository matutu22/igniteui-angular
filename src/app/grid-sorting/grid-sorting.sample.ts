import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
    IgxColumnComponent,
    IgxGridComponent,
    SortingDirection,
    CsvFileTypes,
    ISortingExpression,
    SortingStrategy,
    ISortingStrategy,
    IGroupByRecord,
    SortingStateDefaults,
} from 'igniteui-angular';


@Component({
    selector: 'app-grid-sample',
    styleUrls: [ 'grid-sorting.sample.css'],
    templateUrl: 'grid-sorting.sample.html'
})
export class GridSortingSampleComponent implements OnInit, AfterViewInit {
    @ViewChild('grid1')
    grid1: IgxGridComponent;
    localData: any[];
    useCustomStrategy: boolean;
    customStrategy = new CustomSortingStrategy();
    defaultStrategy = new SortingStrategy();
    sortedData: any[];

    constructor() {
    }

    ngOnInit(): void {
        this.localData = [
            { ID: 1, Name: 'A', Name2: 'A' },
            { ID: 2, Name: 'Aa', Name2: 'Аc' },
            { ID: 2, Name: 'Aа', Name2: 'Аa' },
            { ID: 2, Name: 'Aa', Name2: 'D' },
            { ID: 5, Name: 'C', Name2: 'AB' },
            { ID: 6, Name: 'D', Name2: 'CA' },
            { ID: 7, Name: 'E', Name2: 'BB' }
        ];

        this.grid1.sortingExpressions = [
            { fieldName: 'Name', dir: SortingDirection.Asc, ignoreCase: true },
            { fieldName: 'ID', dir: SortingDirection.Desc }
        ];
    }

    ngAfterViewInit() {
        this.grid1.cdr.detectChanges();
    }

    initColumns(event: IgxColumnComponent) {
        const column: IgxColumnComponent = event;
        column.sortable = true;
        if (column.field === 'Name' || column.field === 'Name2') {
            column.filterable = true;
            column.sortStrategy = this.useCustomStrategy ? this.customStrategy : this.defaultStrategy;
            column.groupable = true;
            column.editable = true;
        }
    }

    multiSorting(event: any) {
        this.grid1.sort([
            { fieldName: 'Name', dir: SortingDirection.Asc },
            { fieldName: 'Name', dir: SortingDirection.Desc}]
        );
    }

    setStrategy(event: any) {

    }
}

class CustomSortingStrategy extends SortingStrategy {
    public compareValues(a: any, b: any) {
        console.log('using custom strategy');
        const an = (a === null || a === undefined);
        const bn = (b === null || b === undefined);
        if (an) {
            if (bn) {
                return 0;
            }
            return -1;
        } else if (bn) {
            return 1;
        }
        return a > b ? 1 : a < b ? -1 : 0;
    }
}
