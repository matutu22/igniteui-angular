import { Component, ViewChild } from '@angular/core';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxTreeGridModule, IgxTreeGridComponent, IgxTreeGridRowComponent } from './index';
import { IgxTreeGridExpandingComponent } from '../test-utils/tree-grid-components.spec';
import { TreeGridFunctions } from '../test-utils/tree-grid-functions.spec';

describe('IgxTreeGrid - Expanding/Collapsing actions', () => {
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

    it('check row expanding and collapsing are changing rows count using (UI)', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        let rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);

        const firstRow = rows[0];
        const indicatorDiv = TreeGridFunctions.getExpansionIndicatorDiv(firstRow);
        indicatorDiv.triggerEventHandler('click', new Event('click'));

        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(7);
        indicatorDiv.triggerEventHandler('click', new Event('click'));

        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);
    });

    it('check row expanding and collapsing are changing rows count (API)', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        let rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);

        (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(0)).rowID);
        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(7);

        (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(0)).rowID);
        rows = TreeGridFunctions.getAllRows(fix);
        expect(rows.length).toBe(4);
    });

    it('check expand/collapse indicator changes (UI)', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();

        const rows = TreeGridFunctions.getAllRows(fix);
        rows.forEach(row => {
            TreeGridFunctions.verifyTreeRowHasCollapsedIcon(row);
        });

        for (let rowToToggle = 0; rowToToggle < rows.length; rowToToggle++) {
            const indicatorDiv = TreeGridFunctions.getExpansionIndicatorDiv(rows[rowToToggle]);
            indicatorDiv.triggerEventHandler('click', new Event('click'));

            for (let rowToCheck = 0; rowToCheck < rows.length; rowToCheck++) {
                if (rowToCheck === rowToToggle) {
                    TreeGridFunctions.verifyTreeRowHasExpandedIcon(rows[rowToCheck]);
                } else {
                    TreeGridFunctions.verifyTreeRowHasCollapsedIcon(rows[rowToCheck]);
                }
            }

            indicatorDiv.triggerEventHandler('click', new Event('click'));
        }

        rows.forEach(row => {
            TreeGridFunctions.verifyTreeRowHasCollapsedIcon(row);
        });
    });

    it('check expand/collapse indicator changes (API)', () => {
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

    it('check second level records are having the corrent indentation (UI)', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();

        const rows = TreeGridFunctions.getAllRows(fix);
        const indicatorDiv = TreeGridFunctions.getExpansionIndicatorDiv(rows[0]);
        indicatorDiv.triggerEventHandler('click', new Event('click'));

        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 1, 1); // fix, rowIndex, expectedLevel
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 2, 1);
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 3, 1);
    });

    it('check second level records are having the corrent indentation (API)', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(0)).rowID);

        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 1, 1); // fix, rowIndex, expectedLevel
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 2, 1);
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 3, 1);
    });

    it('check third level records are having the corrent indentation (UI)', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();

        // expand second level records
        let rows = TreeGridFunctions.getAllRows(fix);
        let indicatorDiv = TreeGridFunctions.getExpansionIndicatorDiv(rows[0]);
        indicatorDiv.triggerEventHandler('click', new Event('click'));

        // expand third level record
        rows = TreeGridFunctions.getAllRows(fix);
        indicatorDiv = TreeGridFunctions.getExpansionIndicatorDiv(rows[3]);
        indicatorDiv.triggerEventHandler('click', new Event('click'));

        // check third level records indentation
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 4, 2); // fix, rowIndex, expectedLevel
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 5, 2);
    });

    it('check third level records are having the corrent indentation (API)', () => {
        const fix = TestBed.createComponent(IgxTreeGridExpandingComponent);
        fix.detectChanges();
        const grid = fix.componentInstance.treeGrid;

        // expand second level records
        (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(0)).rowID);

        // expand third level record
        (<IgxTreeGridComponent>grid).toggleRowExpansion((<IgxTreeGridRowComponent>grid.getRowByIndex(3)).rowID);

        // check third level records indentation
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 4, 2); // fix, rowIndex, expectedLevel
        TreeGridFunctions.verifyRowIndentationLevelByIndex(fix, 5, 2);
    });

});
