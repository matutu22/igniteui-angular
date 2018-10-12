import { Component, ViewChild } from '@angular/core';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxTreeGridModule, IgxTreeGridComponent } from './index';
import { IgxRowComponent } from '../grid-common/row.component';
import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { IgxStringFilteringOperand, IgxNumberFilteringOperand,
    IgxBooleanFilteringOperand, IgxDateFilteringOperand, IgxFilteringOperand, FilteringExpressionsTree } from '../../public_api';
import { IgxTreeGridFilteringComponent } from '../test-utils/tree-grid-components.spec';

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

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(0))).toEqual(true);
        expect(grid.getCellByColumn(0, 'Name').value).toEqual('John Winchester');

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(1))).toEqual(true);
        expect(grid.getCellByColumn(1, 'Name').value).toEqual('Michael Langdon');

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(2))).toEqual(true);
        expect(grid.getCellByColumn(2, 'Name').value).toEqual('Monica Reyes');

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(3))).toEqual(true);
        expect(grid.getCellByColumn(3, 'Name').value).toEqual('Roland Mendel');

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(4))).toEqual(true);
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

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(0))).toEqual(true);
        expect(grid.getCellByColumn(0, 'Name').value).toEqual('John Winchester');

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(1))).toEqual(true);
        expect(grid.getCellByColumn(1, 'Name').value).toEqual('Michael Langdon');

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(2))).toEqual(true);
        expect(grid.getCellByColumn(2, 'Name').value).toEqual('Ana Sanders');

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(3))).toEqual(true);
        expect(grid.getCellByColumn(3, 'Name').value).toEqual('Laurence Johnson');

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(4))).toEqual(true);
        expect(grid.getCellByColumn(4, 'Name').value).toEqual('Victoria Lincoln');

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });

    it('should correctly filter a number column using the \'greaterThan\' filtering conditions', () => {
        const fix = TestBed.createComponent(IgxTreeGridFilteringComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }

        grid.filter('ID', 500, IgxNumberFilteringOperand.instance().condition('greaterThan'));
        fix.detectChanges();

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(0))).toEqual(true);
        expect(grid.getCellByColumn(0, 'ID').value).toEqual(147);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(1))).toEqual(true);
        expect(grid.getCellByColumn(1, 'ID').value).toEqual(957);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(2))).toEqual(true);
        expect(grid.getCellByColumn(2, 'ID').value).toEqual(317);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(3))).toEqual(true);
        expect(grid.getCellByColumn(3, 'ID').value).toEqual(711);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(4))).toEqual(true);
        expect(grid.getCellByColumn(4, 'ID').value).toEqual(998);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(5))).toEqual(true);
        expect(grid.getCellByColumn(5, 'ID').value).toEqual(847);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(6))).toEqual(true);
        expect(grid.getCellByColumn(6, 'ID').value).toEqual(663);

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });

    it('should correctly filter a number column using the \'lessThan\' filtering conditions', () => {
        const fix = TestBed.createComponent(IgxTreeGridFilteringComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }

        grid.filter('ID', 200, IgxNumberFilteringOperand.instance().condition('lessThan'));
        fix.detectChanges();

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(0))).toEqual(true);
        expect(grid.getCellByColumn(0, 'ID').value).toEqual(147);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(1))).toEqual(true);
        expect(grid.getCellByColumn(1, 'ID').value).toEqual(847);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(2))).toEqual(true);
        expect(grid.getCellByColumn(2, 'ID').value).toEqual(663);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(3))).toEqual(true);
        expect(grid.getCellByColumn(3, 'ID').value).toEqual(141);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(4))).toEqual(true);
        expect(grid.getCellByColumn(4, 'ID').value).toEqual(19);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(5))).toEqual(true);
        expect(grid.getCellByColumn(5, 'ID').value).toEqual(15);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(6))).toEqual(true);
        expect(grid.getCellByColumn(6, 'ID').value).toEqual(19);

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });

    it('should correctly filter a date column using the \'before\' filtering conditions', () => {
        const fix = TestBed.createComponent(IgxTreeGridFilteringComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }

        grid.filter('HireDate', new Date(2010, 6, 25), IgxDateFilteringOperand.instance().condition('before'));
        fix.detectChanges();

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(0))).toEqual(true);
        expect(grid.getCellByColumn(0, 'ID').value).toEqual(147);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(1))).toEqual(true);
        expect(grid.getCellByColumn(1, 'ID').value).toEqual(957);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(2))).toEqual(true);
        expect(grid.getCellByColumn(2, 'ID').value).toEqual(317);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(3))).toEqual(true);
        expect(grid.getCellByColumn(3, 'ID').value).toEqual(998);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(4))).toEqual(true);
        expect(grid.getCellByColumn(4, 'ID').value).toEqual(847);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(5))).toEqual(true);
        expect(grid.getCellByColumn(5, 'ID').value).toEqual(663);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(6))).toEqual(true);
        expect(grid.getCellByColumn(6, 'ID').value).toEqual(141);

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });

    it('should correctly filter a date column using the \'after\' filtering conditions', () => {
        const fix = TestBed.createComponent(IgxTreeGridFilteringComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }

        grid.filter('HireDate', new Date(2015, 6, 25), IgxDateFilteringOperand.instance().condition('after'));
        fix.detectChanges();

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(0))).toEqual(true);
        expect(grid.getCellByColumn(0, 'ID').value).toEqual(147);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(1))).toEqual(true);
        expect(grid.getCellByColumn(1, 'ID').value).toEqual(317);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(2))).toEqual(true);
        expect(grid.getCellByColumn(2, 'ID').value).toEqual(711);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(3))).toEqual(true);
        expect(grid.getCellByColumn(3, 'ID').value).toEqual(847);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(4))).toEqual(true);
        expect(grid.getCellByColumn(4, 'ID').value).toEqual(663);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(5))).toEqual(true);
        expect(grid.getCellByColumn(5, 'ID').value).toEqual(19);

        expect(FilteringHelpers.checkRowIsGrayedOut(grid.getRowByIndex(6))).toEqual(true);
        expect(grid.getCellByColumn(6, 'ID').value).toEqual(15);

        expect(FilteringHelpers.checkRowIsNotGrayedOut(grid.getRowByIndex(7))).toEqual(true);
        expect(grid.getCellByColumn(7, 'ID').value).toEqual(101);

        grid.clearFilter();
        fix.detectChanges();

        for (let i = 0; i < 5; i++) {
            expect(grid.getRowByIndex(i).nativeElement.style.opacity).toEqual('1');
        }
    });
});

export class FilteringHelpers {

    // returns true if a tree-grid row is 'grayed out'
    public static checkRowIsGrayedOut(row: IgxRowComponent<IGridBaseComponent>): boolean {
        return row.nativeElement.style.opacity === '0.5';
    }

    // returns true if a tree-grid row is NOT 'grayed out'
    public static checkRowIsNotGrayedOut(row: IgxRowComponent<IGridBaseComponent>): boolean {
        return row.nativeElement.style.opacity === '1';
    }

}
