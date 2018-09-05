import { DOCUMENT, CommonModule } from '@angular/common';
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ContentChildren,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Inject,
    Input,
    IterableChangeRecord,
    IterableDiffers,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    NgModule
} from '@angular/core';
import { Subject, of } from 'rxjs';
import { take, takeUntil, debounceTime, merge, delay, repeat } from 'rxjs/operators';
import { IgxSelectionAPIService } from '../core/selection';
import { cloneArray, DisplayDensity } from '../core/utils';
import { DataType } from '../data-operations/data-util';
import { FilteringLogic, IFilteringExpression } from '../data-operations/filtering-expression.interface';
import { IGroupByExpandState } from '../data-operations/groupby-expand-state.interface';
import { GroupedRecords, IGroupByRecord } from '../data-operations/groupby-record.interface';
import { ISortingExpression, SortingDirection } from '../data-operations/sorting-expression.interface';
import { IForOfState, IgxForOfDirective, IgxForOfModule } from '../directives/for-of/for_of.directive';
import { IgxTextHighlightDirective } from '../directives/text-highlight/text-highlight.directive';
import { IgxBaseExporter, IgxExporterOptionsBase } from '../services/index';
import { IgxCheckboxComponent } from './../checkbox/checkbox.component';
import { IgxGridAPIService } from './api.service';
import { IgxGridCellComponent } from './cell.component';
import { IColumnVisibilityChangedEventArgs } from './column-hiding-item.directive';
import { IgxColumnComponent } from './column.component';
import { ISummaryExpression } from './grid-summary';
import { IgxGroupByRowTemplateDirective, IgxColumnMovingDragDirective } from './grid.common';
import { IgxGridToolbarComponent } from './grid-toolbar.component';
import { IgxGridSortingPipe, IgxGridPreGroupingPipe, IgxGridPostGroupingPipe } from './grid.pipes';
import { IgxGridGroupByRowComponent } from './groupby-row.component';
import { IgxGridRowComponent } from './row.component';
import { DataUtil, IFilteringOperation, IFilteringExpressionsTree, FilteringExpressionsTree, IgxGridModule } from '../../public_api';
import { IgxGridHeaderComponent } from './grid-header.component';
import { IgxOverlayOutletDirective } from '../directives/toggle/toggle.directive';
import { IgxGridComponent } from './grid.component';
import { FormsModule } from '@angular/forms';
import { IgxHierarchicalRowComponent } from './hierarchical-row.component';
import { IgxChildLayoutComponent } from './igx-layout.component';

let NEXT_ID = 0;
const DEBOUNCE_TIME = 16;
const MINIMUM_COLUMN_WIDTH = 136;

/**
 * **Ignite UI for Angular Hierarchical Grid** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/hierarchical-grid.component.html)
 *
 * The Ignite UI Grid is used for presenting and manipulating tabular data in the simplest way possible.  Once data
 * has been bound, it can be manipulated through filtering, sorting & editing operations.
 *
 * Example:
 * ```html
 * <igx-hierarchical-grid [data]="employeeData" autoGenerate="false">
 *   <igx-column field="first" header="First Name"></igx-column>
 *   <igx-column field="last" header="Last Name"></igx-column>
 *   <igx-column field="role" header="Role"></igx-column>
 * </igx-hierarchical-grid>
 * ```
 */
// @Component({

//     preserveWhitespaces: false,
//     selector: 'igx-hierarchical-grid',
//     templateUrl: './hierarchical-grid.component.html'
// })
// export class IgxHierarchicalGridComponent extends IgxGridComponent {
//     constructor(
//         protected gridAPI: IgxGridAPIService,
//         public selectionAPI: IgxSelectionAPIService,
//         protected elementRef: ElementRef,
//         protected zone: NgZone,
//         @Inject(DOCUMENT) public document,
//         public cdr: ChangeDetectorRef,
//         protected resolver: ComponentFactoryResolver,
//         protected differs: IterableDiffers,
//         protected viewRef: ViewContainerRef) {
//         super(gridAPI, selectionAPI, elementRef, zone, document, cdr, resolver, differs, viewRef);

//     }

//     /**
//      * @hidden
//      */
//     @ContentChildren(IgxChildLayoutComponent, { read: IgxChildLayoutComponent, descendants: true })
//     public childLayoutList: QueryList<IgxChildLayoutComponent>;

//     /**
//      * @hidden
//      */
//     public isHierarchicalRecord(record: any): boolean {
//         return this.childLayoutList.length !== 0;
//     }
// }

// @NgModule({
//     declarations: [
//         IgxHierarchicalGridComponent, IgxHierarchicalRowComponent, IgxChildLayoutComponent
//     ],
//     exports: [IgxHierarchicalGridComponent, IgxChildLayoutComponent],
//     imports: [IgxGridModule, FormsModule, CommonModule, IgxForOfModule]
// })
// export class IgxHierarchicalGridModule {}