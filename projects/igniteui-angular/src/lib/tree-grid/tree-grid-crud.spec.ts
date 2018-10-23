import { Component, ViewChild } from '@angular/core';
import { async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IgxTreeGridModule, IgxTreeGridComponent, IgxTreeGridRowComponent } from './index';
import { IgxTreeGridSimpleComponent } from '../test-utils/tree-grid-components.spec';
import { TreeGridFunctions } from '../test-utils/tree-grid-functions.spec';

describe('IgxTreeGrid - CRUD', () => {

    let fix;
    let treeGrid: IgxTreeGridComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxTreeGridSimpleComponent
            ],
            imports: [IgxTreeGridModule]
        })
        .compileComponents();
    }));

    describe('IgxTreeGrid - CRUD - Create', () => {
        beforeEach(() => {
            fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
            fix.detectChanges();
            treeGrid = fix.componentInstance.treeGrid;
        });

    });

    describe('IgxTreeGrid - CRUD - Read', () => {
        beforeEach(() => {
            fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
            fix.detectChanges();
            treeGrid = fix.componentInstance.treeGrid;
        });

    });

    describe('IgxTreeGrid - CRUD - Update', () => {
        beforeEach(() => {
            fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
            fix.detectChanges();
            treeGrid = fix.componentInstance.treeGrid;
        });

    });

    describe('IgxTreeGrid - CRUD - Delete', () => {
        beforeEach(() => {
            fix = TestBed.createComponent(IgxTreeGridSimpleComponent);
            fix.detectChanges();
            treeGrid = fix.componentInstance.treeGrid;
        });

    });

});

