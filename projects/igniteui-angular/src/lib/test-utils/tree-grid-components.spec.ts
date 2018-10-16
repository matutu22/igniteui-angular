import { Component, ViewChild } from '@angular/core';
import { IgxTreeGridComponent } from '../tree-grid/tree-grid.component';
import { SampleTestData } from './sample-test-data.spec';
import { Calendar } from '../calendar/calendar';

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'ID'" [sortable]="true"></igx-column>
        <igx-column [field]="'Name'" [sortable]="true"></igx-column>
        <igx-column [field]="'HireDate'" [sortable]="true"></igx-column>
        <igx-column [field]="'Age'" [sortable]="true"></igx-column>
    </igx-tree-grid>
        `
})
export class IgxTreeGridSortingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expandedLevels="2" width="900px" height="600px">
        <igx-column [field]="'ID'" [filterable]="true"></igx-column>
        <igx-column [field]="'Name'" [filterable]="true"></igx-column>
        <igx-column [field]="'HireDate'" [filterable]="true"></igx-column>
        <igx-column [field]="'Age'" [filterable]="true"></igx-column>
    </igx-tree-grid>
        `
})
export class IgxTreeGridFilteringComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
    public timeGenerator: Calendar = new Calendar();
    public today: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" width="900px" height="600px">
        <igx-column [field]="'ID'"></igx-column>
        <igx-column [field]="'Name'"></igx-column>
        <igx-column [field]="'HireDate'"></igx-column>
        <igx-column [field]="'Age'"></igx-column>
    </igx-tree-grid>
        `
})
export class IgxTreeGridSimpleComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeSmallTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" primaryKey="ID" foreignKey="ParentID" width="900px" height="600px">
        <igx-column [field]="'ID'"></igx-column>
        <igx-column [field]="'ParentID'"></igx-column>
        <igx-column [field]="'Name'"></igx-column>
        <igx-column [field]="'JobTitle'"></igx-column>
        <igx-column [field]="'Age'"></igx-column>
    </igx-tree-grid>
        `
})
export class IgxTreeGridPrimaryForeignKeyComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeePrimaryForeignKeyTreeData();
}

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expandedLevels="0" width="900px" height="600px"
        [paging]="true" [perPage]="10">
        <igx-column [field]="'ID'"></igx-column>
        <igx-column [field]="'Name'"></igx-column>
        <igx-column [field]="'HireDate'"></igx-column>
        <igx-column [field]="'Age'"></igx-column>
    </igx-tree-grid>
    `
})
export class IgxTreeGridExpandingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}
