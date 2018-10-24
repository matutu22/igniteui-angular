import { Component, ViewChild } from '@angular/core';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxTreeGridModule, IgxTreeGridComponent, IgxTreeGridRowComponent } from './index';
import { IgxTreeGridSimpleComponent, IgxTreeGridPrimaryForeignKeyComponent } from '../test-utils/tree-grid-components.spec';
import { TreeGridFunctions } from '../test-utils/tree-grid-functions.spec';
import { first } from 'rxjs/operators';

describe('IgxTreeGrid - CRUD', () => {
    let fix;
    let treeGrid: IgxTreeGridComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTreeGridSimpleComponent,
                IgxTreeGridPrimaryForeignKeyComponent
            ],
            imports: [IgxTreeGridModule]
        })
        .compileComponents();
    }));

    describe('Create', () => {
        describe('Child Collection', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
                treeGrid.height = '800px';
                fix.detectChanges();
            });

            it('should support adding root row through treeGrid API', () => {
                verifyRowsCount(fix, 3, 10);
                verifyTreeGridRecordsCount(fix, 3, 10);
                verifyProcessedTreeGridRecordsCount(fix, 3, 10);

                spyOn(treeGrid.onRowAdded, 'emit');
                const newRow = {
                    ID: 777,
                    Name: 'New Employee',
                    HireDate: new Date(2018, 3, 22),
                    Age: 25,
                    Employees: []
                };
                treeGrid.addRow(newRow);
                fix.detectChanges();

                const rowDataEventArgs = /* IRowDataEventArgs */ { data: newRow };
                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith(rowDataEventArgs);
                verifyRowsCount(fix, 4, 11);
                verifyTreeGridRecordsCount(fix, 4, 11);
                verifyProcessedTreeGridRecordsCount(fix, 4, 11);
            });

            it('should support adding child rows through treeGrid API', () => {
                verifyRowsCount(fix, 3, 10);
                verifyTreeGridRecordsCount(fix, 3, 10);
                verifyProcessedTreeGridRecordsCount(fix, 3, 10);

                // Add child row on level 2
                spyOn(treeGrid.onRowAdded, 'emit');
                let newRow = {
                    ID: 777,
                    Name: 'TEST NAME 1',
                    HireDate: new Date(2018, 3, 22),
                    Age: 25,
                    Employees: []
                };
                treeGrid.addChildRow(847, newRow);
                fix.detectChanges();

                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith({ data: newRow });
                verifyRowsCount(fix, 3, 11);
                verifyTreeGridRecordsCount(fix, 3, 11);
                verifyProcessedTreeGridRecordsCount(fix, 3, 11);

                // Add child row on level 3
                newRow = {
                    ID: 999,
                    Name: 'TEST NAME 2',
                    HireDate: new Date(2018, 5, 17),
                    Age: 35,
                    Employees: []
                };
                treeGrid.addChildRow(317, newRow);
                fix.detectChanges();

                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith({ data: newRow });
                verifyRowsCount(fix, 3, 12);
                verifyTreeGridRecordsCount(fix, 3, 12);
                verifyProcessedTreeGridRecordsCount(fix, 3, 12);
            });

            it('should support adding child row to \'null\' collection through treeGrid API', () => {
                // Add child row to a row that has a child collection set to 'null'
                spyOn(treeGrid.onRowAdded, 'emit');
                const newRow = {
                    ID: 888,
                    Name: 'TEST Child',
                    HireDate: new Date(2011, 1, 11),
                    Age: 25,
                    Employees: []
                };
                treeGrid.addChildRow(475, newRow);
                fix.detectChanges();

                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith({ data: newRow });
                verifyRowsCount(fix, 3, 11);
                verifyTreeGridRecordsCount(fix, 3, 11);
                verifyProcessedTreeGridRecordsCount(fix, 3, 11);
            });

            it('should support adding child row to \'undefined\' collection through treeGrid API', () => {
                // Add child row to a row that has a child collection set to 'undefined'
                spyOn(treeGrid.onRowAdded, 'emit');
                const newRow = {
                    ID: 888,
                    Name: 'TEST Child',
                    HireDate: new Date(2011, 1, 11),
                    Age: 25,
                    Employees: []
                };
                treeGrid.addChildRow(957, newRow);
                fix.detectChanges();

                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith({ data: newRow });
                verifyRowsCount(fix, 3, 11);
                verifyTreeGridRecordsCount(fix, 3, 11);
                verifyProcessedTreeGridRecordsCount(fix, 3, 11);
            });

            it('should support adding child row to \'non-existing\' collection through treeGrid API', () => {
                // Add child row to a row that has a child collection set to 'undefined'
                spyOn(treeGrid.onRowAdded, 'emit');
                const newRow = {
                    ID: 888,
                    Name: 'TEST Child',
                    HireDate: new Date(2011, 1, 11),
                    Age: 25,
                    Employees: []
                };
                treeGrid.addChildRow(711, newRow);
                fix.detectChanges();

                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith({ data: newRow });
                verifyRowsCount(fix, 3, 11);
                verifyTreeGridRecordsCount(fix, 3, 11);
                verifyProcessedTreeGridRecordsCount(fix, 3, 11);
            });
        });

        describe('Primary/Foreign key', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridPrimaryForeignKeyComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
                treeGrid.height = '800px';
                fix.detectChanges();
            });

            it('should support adding root row through treeGrid API', () => {
                verifyRowsCount(fix, 8, 8);
                verifyTreeGridRecordsCount(fix, 3, 8);
                verifyProcessedTreeGridRecordsCount(fix, 3, 8);

                spyOn(treeGrid.onRowAdded, 'emit');
                const newRow = {
                    ID: 777,
                    ParentID: -1,
                    Name: 'New Employee',
                    JobTitle: "Senior Web Developer",
                    Age: 33
                };
                treeGrid.addRow(newRow);
                fix.detectChanges();

                const rowDataEventArgs = /* IRowDataEventArgs */ { data: newRow };
                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith(rowDataEventArgs);
                verifyRowsCount(fix, 9, 9);
                verifyTreeGridRecordsCount(fix, 4, 9);
                verifyProcessedTreeGridRecordsCount(fix, 4, 9);
            });

            it('should support adding child rows through treeGrid API', () => {
                verifyRowsCount(fix, 8, 8);
                verifyTreeGridRecordsCount(fix, 3, 8);
                verifyProcessedTreeGridRecordsCount(fix, 3, 8);

                // Add child row on level 1
                spyOn(treeGrid.onRowAdded, 'emit');
                let newRow = {
                    ID: 777,
                    ParentID: 1,
                    Name: 'New Employee 1',
                    JobTitle: "Senior Web Developer",
                    Age: 33
                };
                treeGrid.addChildRow(1, newRow);
                fix.detectChanges();

                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith({ data: newRow });
                verifyRowsCount(fix, 9, 9);
                verifyTreeGridRecordsCount(fix, 3, 9);
                verifyProcessedTreeGridRecordsCount(fix, 3, 9);

                // Add child row on level 3
                newRow = {
                    ID: 333,
                    ParentID: 4,
                    Name: 'New Employee 2',
                    JobTitle: "Senior Web Developer",
                    Age: 33
                };
                treeGrid.addChildRow(4, newRow);
                fix.detectChanges();

                expect(treeGrid.onRowAdded.emit).toHaveBeenCalledWith({ data: newRow });
                verifyRowsCount(fix, 10, 10);
                verifyTreeGridRecordsCount(fix, 3, 10);
                verifyProcessedTreeGridRecordsCount(fix, 3, 10);
            });
        });
    });

    describe('Read', () => {
        describe('Child Collection', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
            });
        });

        describe('Primary/Foreign key', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
            });
        });
    });

    describe('Update', () => {
        describe('Child Collection', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
            });
        });

        describe('Primary/Foreign key', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
            });
        });
    });

    describe('Delete', () => {
        describe('Child Collection', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
            });

            it('should delete a row by ID', () => {
                let someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(147);

                verifyRowsCount(fix, 3, 10);
                verifyTreeGridRecordsCount(fix, 3, 10);
                verifyProcessedTreeGridRecordsCount(fix, 3, 10);

                treeGrid.deleteRow(someRow.rowID);
                fix.detectChanges();
                someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(19);

                verifyRowsCount(fix, 2, 3);
                verifyTreeGridRecordsCount(fix, 2, 3);
                verifyProcessedTreeGridRecordsCount(fix, 2, 3);
            });

            it('should delete a row through the row object', () => {
                let someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(147);

                verifyRowsCount(fix, 3, 10);
                verifyTreeGridRecordsCount(fix, 3, 10);
                verifyProcessedTreeGridRecordsCount(fix, 3, 10);

                someRow.delete();
                fix.detectChanges();
                someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(19);

                verifyRowsCount(fix, 2, 3);
                verifyTreeGridRecordsCount(fix, 2, 3);
                verifyProcessedTreeGridRecordsCount(fix, 2, 3);
            });

            it('should emit an event when deleting row by ID', (done) => {
                treeGrid.onRowDeleted.pipe(first()).subscribe((args) => {
                    expect(args.data.ID).toBe(147);
                    expect(args.data.Name).toBe('John Winchester');
                    done();
                });
                const someRow = treeGrid.getRowByIndex(0);
                treeGrid.deleteRow(someRow.rowID);
            });

            it('should emit an event when deleting row through the row object', (done) => {
                treeGrid.onRowDeleted.pipe(first()).subscribe((args) => {
                    expect(args.data.ID).toBe(147);
                    expect(args.data.Name).toBe('John Winchester');
                    done();
                });
                const someRow = treeGrid.getRowByIndex(0);
                someRow.delete();
            });
        });

        describe('Primary/Foreign key', () => {
            beforeEach(() => {
                fix = TestBed.createComponent(IgxTreeGridPrimaryForeignKeyComponent);
                fix.detectChanges();
                treeGrid = fix.componentInstance.treeGrid;
            });

            it('should delete a row by ID', () => {
                let someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(1);

                verifyRowsCount(fix, 10, 8);
                verifyTreeGridRecordsCount(fix, 3, 10);
                verifyProcessedTreeGridRecordsCount(fix, 3, 8);

                treeGrid.deleteRow(someRow.rowID);
                fix.detectChanges();
                someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(2);

                verifyRowsCount(fix, 9, 7);
                verifyTreeGridRecordsCount(fix, 4, 9);
                verifyProcessedTreeGridRecordsCount(fix, 4, 7);
            });

            it('should delete a row through the row object', () => {
                let someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(1);

                verifyRowsCount(fix, 10, 8);
                verifyTreeGridRecordsCount(fix, 3, 10);
                verifyProcessedTreeGridRecordsCount(fix, 3, 8);

                someRow.delete();
                fix.detectChanges();
                someRow = treeGrid.getRowByIndex(0);
                expect(someRow.rowID).toBe(2);

                verifyRowsCount(fix, 9, 7);
                verifyTreeGridRecordsCount(fix, 4, 9);
                verifyProcessedTreeGridRecordsCount(fix, 4, 7);
            });

            it('should emit an event when deleting row by ID', (done) => {
                treeGrid.onRowDeleted.pipe(first()).subscribe((args) => {
                    expect(args.data.ID).toBe(1);
                    expect(args.data.Name).toBe('Casey Houston');
                    done();
                });
                const someRow = treeGrid.getRowByIndex(0);
                treeGrid.deleteRow(someRow.rowID);
            });

            it('should emit an event when deleting row through the row object', (done) => {
                treeGrid.onRowDeleted.pipe(first()).subscribe((args) => {
                    expect(args.data.ID).toBe(1);
                    expect(args.data.Name).toBe('Casey Houston');
                    done();
                });
                const someRow = treeGrid.getRowByIndex(0);
                someRow.delete();
            });
        });

    });
});

function verifyRowsCount(fix, expectedRootRowsCount, expectedVisibleRowsCount) {
    const treeGrid = fix.componentInstance.treeGrid;
    expect(TreeGridFunctions.getAllRows(fix).length).toBe(expectedVisibleRowsCount, 'Incorrect DOM rows length after adding.');
    expect(treeGrid.data.length).toBe(expectedRootRowsCount, 'Incorrect data length after adding.');
    expect(treeGrid.dataRowList.length).toBe(expectedVisibleRowsCount, 'Incorrect dataRowList length after adding.');
}

function verifyTreeGridRecordsCount(fix, expectedRecordsCount, expectedFlatRecordsCount) {
    const treeGrid = fix.componentInstance.treeGrid as IgxTreeGridComponent;
    expect(treeGrid.treeGridRecords.length).toBe(expectedRecordsCount);
    expect(treeGrid.treeGridRecordsMap.size).toBe(expectedFlatRecordsCount);
}

function verifyProcessedTreeGridRecordsCount(fix, expectedProcessedRecordsCount, expectedProcessedFlatRecordsCount) {
    const treeGrid = fix.componentInstance.treeGrid as IgxTreeGridComponent;
    expect(treeGrid.processedTreeGridRecords.length).toBe(expectedProcessedRecordsCount);
    expect(treeGrid.processedTreeGridRecordsMap.size).toBe(expectedProcessedFlatRecordsCount);
}
