import { Component, ElementRef, ChangeDetectorRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { IgxDropDownBase} from '../../drop-down/drop-down.base';
import { IGX_DROPDOWN_BASE } from '../../drop-down/drop-down.common';
import { DropDownActionKey, IgxDropDownItemBase } from '../../drop-down';
import { IgxAutocompleteDirective } from './autocomplete.directive';

@Component({
    selector: 'igx-autocomplete-dropdown',
    templateUrl: 'autocomplete.dropdown.component.html',
    providers: [{ provide: IGX_DROPDOWN_BASE, useExisting: IgxAutocompleteDropDownComponent }]
})
export class IgxAutocompleteDropDownComponent extends IgxDropDownBase {
    constructor(
        protected elementRef: ElementRef,
        protected cdr: ChangeDetectorRef) {
        super(elementRef, cdr);
    }

    @ViewChild('defaultItemTemplate', { read: TemplateRef })
    protected defaultItemTemplate: TemplateRef<any>;

    @Input()
    data = [];

    @Input()
    itemTemplate: TemplateRef<any>;

    @Input()
    width: any;

    @Input()
    condition: (item: any, term: any) => boolean;

    @Input()
    term = '';

    @Input()
    autocomplete: IgxAutocompleteDirective; // ?

    get template(): TemplateRef<any> {
        return this.itemTemplate ? this.itemTemplate : this.defaultItemTemplate;
    }

    private _collapsed = true;
    public get collapsed(): boolean {
        return this._collapsed;
    }
    public set collapsed(value: boolean) {
        this._collapsed = value;
    }

    public onItemActionKey(key: DropDownActionKey, event?: Event) {
        if (key === DropDownActionKey.ESCAPE) {
            this.autocomplete.close(); // ?
        }
        super.onItemActionKey(key, event);
    }
}