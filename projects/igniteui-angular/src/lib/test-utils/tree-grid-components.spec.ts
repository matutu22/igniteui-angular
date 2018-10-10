import { Component, ViewChild } from '@angular/core';
import { IgxTreeGridComponent } from '../tree-grid';
import { SampleTestData } from './sample-test-data.spec';

@Component({
    template: `
    <igx-tree-grid #treeGrid [data]="data" childDataKey="Employees" expandedLevels="1" width="900px" height="500px">
        <igx-column [field]="'ID'" [sortable]="true"></igx-column>
        <igx-column [field]="'Name'" [sortable]="true"></igx-column>
        <igx-column [field]="'HireDate'" [sortable]="true"></igx-column>
        <igx-column [field]="'Age'" [sortable]="true"></igx-column>
    </igx-tree-grid>
        `
})
export class IgxTreeGridSortingComponent {
    @ViewChild(IgxTreeGridComponent) public treeGrid: IgxTreeGridComponent;
    public data = SampleTestData.employeeTreeData();
}