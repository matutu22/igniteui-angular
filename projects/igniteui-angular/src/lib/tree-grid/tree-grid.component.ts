import {
    ContentChild,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    HostBinding,
    Input,
    IterableDiffers,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef
} from '@angular/core';
import { IgxSelectionAPIService } from '../core/selection';
import { cloneArray, DisplayDensity } from '../core/utils';
import { ISortingExpression } from '../data-operations/sorting-expression.interface';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
import { IgxGridBaseComponent } from '../grid-common/grid-base.component';

import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { GridBaseAPIService } from '../grid-common/api.service';

let NEXT_ID = 0;

/**
 * **Ignite UI for Angular Grid** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/grid.html)
 *
 * The Ignite UI Grid is used for presenting and manipulating tabular data in the simplest way possible.  Once data
 * has been bound, it can be manipulated through filtering, sorting & editing operations.
 *
 * Example:
 * ```html
 * <igx-grid [data]="employeeData" autoGenerate="false">
 *   <igx-column field="first" header="First Name"></igx-column>
 *   <igx-column field="last" header="Last Name"></igx-column>
 *   <igx-column field="role" header="Role"></igx-column>
 * </igx-grid>
 * ```
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: 'igx-tree-grid',
    templateUrl: 'tree-grid.component.html'
})
export class IgxTreeGridComponent extends IgxGridBaseComponent {
    private _id = `igx-tree-grid-${NEXT_ID++}`;

    /**
     * An @Input property that sets the value of the `id` attribute. If not provided it will be automatically generated.
     * ```html
     * <igx-grid [id]="'igx-grid-1'" [data]="Data" [autoGenerate]="true"></igx-grid>
     * ```
	 * @memberof IgxGridComponent
     */
    @HostBinding('attr.id')
    @Input()
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        if (this._id !== value) {
            const oldId = this._id;
            this._id = value;
            this.gridAPI.reset(oldId, this._id);
        }
    }

    private gridAPI: IgxTreeGridAPIService;

    constructor(
        gridAPI: GridBaseAPIService<IGridBaseComponent>,
        selection: IgxSelectionAPIService,
        elementRef: ElementRef,
        cdr: ChangeDetectorRef,
        resolver: ComponentFactoryResolver,
        differs: IterableDiffers,
        viewRef: ViewContainerRef) {
        super(gridAPI, selection, elementRef, cdr, resolver, differs, viewRef);
        this.gridAPI = <IgxTreeGridAPIService>gridAPI;
    }

     /**
    * @hidden
    */
    public getContext(rowData): any {
        return {
            $implicit: rowData,
            // templateID: this.isGroupByRecord(rowData) ? 'groupRow' : 'dataRow'
        };
    }
}
