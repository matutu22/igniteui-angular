import { IgxTreeGridRowComponent } from './tree-grid-row.component';

export interface ITreeGridRecord {
    rowID: any;
    data: any;
    children?: ITreeGridRecord[];
    parent?: ITreeGridRecord;
    isFilteredOutParent?: boolean;
    hasChildren?: boolean;
    indentationLevel?: number;
    expanded?: boolean;
}

export interface ITreeGridRowExpansionEventArgs {
    row: IgxTreeGridRowComponent;
    expanded: boolean;
    event: Event;
    cancel: boolean;
}
