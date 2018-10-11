import { Component, ViewChild } from '@angular/core';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Calendar } from '../calendar/calendar';
import { FilteringLogic, IFilteringExpression } from '../data-operations/filtering-expression.interface';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxTreeGridModule } from './index';
import { IgxStringFilteringOperand, IgxNumberFilteringOperand,
    IgxBooleanFilteringOperand, IgxDateFilteringOperand, IgxFilteringOperand, FilteringExpressionsTree } from '../../public_api';
import { IgxTreeGridFilteringComponent } from '../test-utils/tree-grid-components.spec';

const FILTERING_TOGGLE_CLASS = 'igx-filtering__toggle';
const FILTERING_TOGGLE_FILTERED_CLASS = 'igx-filtering__toggle--filtered';

describe('IgxTreeGrid - Filtering actions', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTreeGridFilteringComponent
            ],
            imports: [
                BrowserAnimationsModule,
                IgxTreeGridModule]
        })
        .compileComponents();
    }));

    it('should correctly filter a string column using the \'contains\' filtering conditions', () => {
        const fix = TestBed.createComponent(IgxTreeGridFilteringComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }

        grid.filter('Name', 'an', IgxStringFilteringOperand.instance().condition('contains'), true);
        fix.detectChanges();

        expect(grid.getRowByIndex(0).nativeElement.style.opacity).toEqual('0.5');
        expect(grid.getCellByColumn(0, 'Name').value).toEqual('John Winchester');

        expect(grid.getRowByIndex(1).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(1, 'Name').value).toEqual('Michael Langdon');

        expect(grid.getRowByIndex(2).nativeElement.style.opacity).toEqual('0.5');
        expect(grid.getCellByColumn(2, 'Name').value).toEqual('Monica Reyes');

        expect(grid.getRowByIndex(3).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(3, 'Name').value).toEqual('Roland Mendel');

        expect(grid.getRowByIndex(4).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(4, 'Name').value).toEqual('Ana Sanders');

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });

    it('should correctly filter a string column using the \'endswith\' filtering conditions', () => {
        const fix = TestBed.createComponent(IgxTreeGridFilteringComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }

        grid.filter('Name', 'n', IgxStringFilteringOperand.instance().condition('endsWith'), true);
        fix.detectChanges();

        expect(grid.getRowByIndex(0).nativeElement.style.opacity).toEqual('0.5');
        expect(grid.getCellByColumn(0, 'Name').value).toEqual('John Winchester');

        expect(grid.getRowByIndex(1).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(1, 'Name').value).toEqual('Michael Langdon');

        expect(grid.getRowByIndex(2).nativeElement.style.opacity).toEqual('0.5');
        expect(grid.getCellByColumn(2, 'Name').value).toEqual('Ana Sanders');

        expect(grid.getRowByIndex(3).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(3, 'Name').value).toEqual('Laurence Johnson');

        expect(grid.getRowByIndex(4).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(4, 'Name').value).toEqual('Victoria Lincoln');

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });

    it('should correctly filter a number column using the \'endswith\' filtering conditions', () => {
        const fix = TestBed.createComponent(IgxTreeGridFilteringComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }

        grid.filter('ID', 500, IgxNumberFilteringOperand.instance().condition('greaterThan'));
        fix.detectChanges();

        expect(grid.getRowByIndex(0).nativeElement.style.opacity).toEqual('0.5');
        expect(grid.getCellByColumn(0, 'ID').value).toEqual(147);

        expect(grid.getRowByIndex(1).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(1, 'ID').value).toEqual(957);

        expect(grid.getRowByIndex(2).nativeElement.style.opacity).toEqual('0.5');
        expect(grid.getCellByColumn(2, 'ID').value).toEqual(317);

        expect(grid.getRowByIndex(3).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(3, 'ID').value).toEqual(711);

        expect(grid.getRowByIndex(4).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(4, 'ID').value).toEqual(998);

        expect(grid.getRowByIndex(5).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(5, 'ID').value).toEqual(847);

        expect(grid.getRowByIndex(6).nativeElement.style.opacity).toEqual('1');
        expect(grid.getCellByColumn(6, 'ID').value).toEqual(663);

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });
});
