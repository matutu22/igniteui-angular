import { Injectable } from '@angular/core';
import { IgxGridComponent } from './grid.component';
import { first } from 'rxjs/operators';

@Injectable()
export class IgxGridNavigationService {

    public grid: IgxGridComponent;

    get displayContainerWidth() {
        return parseInt(this.grid.parentVirtDir.dc.instance._viewContainer.element.nativeElement.offsetWidth, 10);
    }

    get displayContainerScrollLeft() {
        return parseInt(this.grid.parentVirtDir.dc.instance._viewContainer.element.nativeElement.scrollLeft, 10);
    }

    get verticalDisplayContainerElement() {
        return this.grid.verticalScrollContainer.dc.instance._viewContainer.element.nativeElement;
    }

    public horizontalScroll(rowIndex) {
        return this.grid.dataRowList.find((row) => row.index === rowIndex).virtDirRow;
    }

    public isColumnFullyVisible(visibleColumnIndex) {
        return this.displayContainerWidth >=
            parseInt(this.grid.columnList.find((column) => column.visibleIndex === visibleColumnIndex + 1).width, 10) +
            parseInt(this.horizontalScroll(0).getColumnScrollLeft(visibleColumnIndex + 1), 10);
    }

    public isColumnPartiallyVisible(visibleColumnIndex) {
        return this.displayContainerWidth >
            parseInt(this.horizontalScroll(0).getColumnScrollLeft(visibleColumnIndex + 1), 10);
    }

    public onKeydownArrowRight(element, rowIndex, visibleColumnIndex, event) {
        const scrollAmount = parseInt(this.horizontalScroll(rowIndex).getColumnScrollLeft(visibleColumnIndex + 1), 10) +
        parseInt(this.grid.columnList.find((column) => column.visibleIndex === visibleColumnIndex + 1).width, 10) -
        this.displayContainerWidth - this.horizontalScroll(rowIndex).getHorizontalScroll().scrollLeft;
        if (this.isColumnFullyVisible(visibleColumnIndex)) {
            element.nextSibling.focus({preventScroll: true});
        } else {
            if (this.isColumnPartiallyVisible(visibleColumnIndex)) {
                console.log(scrollAmount);
                this.horizontalScroll(rowIndex).getHorizontalScroll().scrollLeft = scrollAmount;
                this.horizontalScroll(rowIndex).onChunkLoad
                .pipe(first())
                .subscribe(() => {
                    console.log(element);
                    element.nextSibling.focus({preventScroll: true});
                });
            } else {
                // this.horizontalScroll(rowIndex).scrollTo(visibleColumnIndex + 1);
                this.horizontalScroll(rowIndex).getHorizontalScroll().scrollLeft +=
                parseInt(this.grid.columnList.find((column) => column.visibleIndex === visibleColumnIndex + 1).width, 10);
                this.horizontalScroll(rowIndex).onChunkLoad
                .pipe(first())
                .subscribe(() => {
                    console.log(element);
                    element.nextSibling.focus({preventScroll: true});
                });
            }
        }
    }
}
