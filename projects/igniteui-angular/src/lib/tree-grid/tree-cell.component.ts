import { Component, forwardRef, Input, HostBinding, ChangeDetectorRef, ElementRef, ViewChild, Inject } from '@angular/core';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxRowComponent } from '../grid-common/row.component';
import { IgxGridCellComponent } from '../grid-common/cell.component';
import { IgxTreeGridRowComponent } from './tree-grid-row.component';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
import { GridBaseAPIService } from '../grid-common/api.service';
import { IGridBaseComponent } from '../grid-common/common/grid-interfaces';
import { IgxSelectionAPIService } from '../core/selection';
import { valToPxlsUsingRange } from '../core/utils';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'igx-tree-grid-cell',
    templateUrl: 'tree-cell.component.html'
})
export class IgxTreeGridCellComponent extends IgxGridCellComponent {
    private treeGridAPI: IgxTreeGridAPIService;

    constructor(gridAPI: GridBaseAPIService<IGridBaseComponent>,
                selection: IgxSelectionAPIService,
                cdr: ChangeDetectorRef,
                element: ElementRef,
                @Inject(DOCUMENT) public document) {
        super(gridAPI, selection, cdr, element);
        this.treeGridAPI = <IgxTreeGridAPIService>gridAPI;
    }

    @ViewChild('indicator', { read: ElementRef })
    public indicator: ElementRef;

    @ViewChild('indentationDiv', { read: ElementRef })
    public indentationDiv: ElementRef;

    public get indentation() {
        return this.row.indentation;
    }

    public get hasChildren() {
        return this.row.treeRow.children && this.row.treeRow.children.length > 0;
    }

    get expanded(): boolean {
        return this.row.expanded;
    }

    public toggle(event: Event) {
        event.stopPropagation();
        this.treeGridAPI.trigger_row_expansion_toggle(this.gridID, this.row, event);
    }

    public onFocus(event: Event) {
        event.stopPropagation();
    }

    public calculateSizeToFit(range: any): number {
        const indicatorWidth = this.indicator.nativeElement.getBoundingClientRect().width;
        const indicatorStyle = this.document.defaultView.getComputedStyle(this.indicator.nativeElement);
        const indicatorMargin = parseFloat(indicatorStyle.marginRight);
        let leftPadding = 0;
        if (this.indentationDiv) {
            const indentationStyle = this.document.defaultView.getComputedStyle(this.indentationDiv.nativeElement);
            leftPadding = parseFloat(indentationStyle.paddingLeft);
        }
        const largestWidth = Math.max(...Array.from(this.nativeElement.children)
            .map((child) => valToPxlsUsingRange(range, child)));
        return largestWidth + indicatorWidth + indicatorMargin + leftPadding;
    }
}
