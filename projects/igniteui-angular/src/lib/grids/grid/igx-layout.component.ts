import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    Input,
    QueryList,
    forwardRef} from '@angular/core';
import { IgxColumnComponent } from '.././column.component';



@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: IgxColumnComponent, useExisting: forwardRef(() => IgxChildLayoutComponent) }],
    selector: 'igx-child-layout',
    template: ``
})
export class IgxChildLayoutComponent implements AfterContentInit {

    @ContentChildren(IgxColumnComponent, { read: IgxColumnComponent })
    children = new QueryList<IgxColumnComponent>();

    @Input() public key: string;

    ngAfterContentInit() {
    }
}


