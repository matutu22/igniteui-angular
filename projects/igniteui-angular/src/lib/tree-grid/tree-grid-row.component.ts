import { Component, forwardRef } from '@angular/core';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxRowComponent } from '../grid-common/row.component';

@Component({
    selector: 'igx-tree-grid-row',
    templateUrl: '../grid-common/row.component.html',
    providers: [{provide: IgxRowComponent, useExisting: forwardRef(() => IgxTreeGridRowComponent)}]
})
export class IgxTreeGridRowComponent extends IgxRowComponent<IgxTreeGridComponent> {
}
