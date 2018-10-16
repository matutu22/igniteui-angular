import { Component, ViewChild } from '@angular/core';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxTreeGridModule, IgxTreeGridComponent, IgxTreeGridRowComponent } from './index';
import { IgxRowComponent } from '../grid-common/row.component';
import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { IgxTreeGridExpandingComponent } from '../test-utils/tree-grid-components.spec';
import { TreeGridFunctions } from '../test-utils/tree-grid-functions.spec';

fdescribe('IgxTreeGrid - Expanding/Collapsing actions', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTreeGridExpandingComponent
            ],
            imports: [
                BrowserAnimationsModule,
                IgxTreeGridModule]
        })
        .compileComponents();
    }));

    it('check row expanding and collapsing are changing rows count using UI', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        let rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);

        const firstRow = rows[0];
        const indicatorDiv = TreeGridFunctions.getExpansionIndicatorDiv(firstRow);

        indicatorDiv.triggerEventHandler('click', new Event('click'));
        fix.detectChanges();

        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(7);

        indicatorDiv.triggerEventHandler('click', new Event('click'));
        fix.detectChanges();

        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);
    });

    it('check row expanding and collapsing are changing rows count using API', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        let rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);

        (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(0)).rowID);

        fix.detectChanges();

        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(7);

        (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(0)).rowID);
        fix.detectChanges();

        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);
    });

    it('check expand/collapse indicator changes using UI', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        const rows = TreeGridFunctions.getAllRows(fix);
        rows.forEach(row => {
            TreeGridFunctions.verifyTreeRowHasCollapsedIcon(row);
        });

        for (let rowToToggle = 0; rowToToggle < rows.length; rowToToggle++) {
            const indicatorDiv = TreeGridFunctions.getExpansionIndicatorDiv(rows[rowToToggle]);
            indicatorDiv.triggerEventHandler('click', new Event('click'));
            fix.detectChanges();

            for (let rowToCheck = 0; rowToCheck < rows.length; rowToCheck++) {
                if (rowToCheck === rowToToggle) {
                    TreeGridFunctions.verifyTreeRowHasExpandedIcon(rows[rowToCheck]);
                } else {
                    TreeGridFunctions.verifyTreeRowHasCollapsedIcon(rows[rowToCheck]);
                }
            }

            indicatorDiv.triggerEventHandler('click', new Event('click'));
            fix.detectChanges();
        }

        rows.forEach(row => {
            TreeGridFunctions.verifyTreeRowHasCollapsedIcon(row);
        });
    });

    it('check expand/collapse indicator changes using API', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        const rows = TreeGridFunctions.getAllRows(fix);
        rows.forEach(row => {
            TreeGridFunctions.verifyTreeRowHasCollapsedIcon(row);
        });

        for (let rowToToggle = 0; rowToToggle < rows.length; rowToToggle++) {
            (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(rowToToggle)).rowID);
            for (let rowToCheck = 0; rowToCheck < rows.length; rowToCheck++) {
                if (rowToCheck === rowToToggle) {
                    TreeGridFunctions.verifyTreeRowHasExpandedIcon(rows[rowToCheck]);
                } else {
                    TreeGridFunctions.verifyTreeRowHasCollapsedIcon(rows[rowToCheck]);
                }
            }
            (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(rowToToggle)).rowID);
        }

        rows.forEach(row => {
            TreeGridFunctions.verifyTreeRowHasCollapsedIcon(row);
        });
    });



});





