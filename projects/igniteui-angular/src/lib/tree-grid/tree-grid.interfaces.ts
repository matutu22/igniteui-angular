import { IgxTreeGridRowComponent } from './tree-grid-row.component';

export interface ITreeGridRowExpansionEventArgs {
    row: IgxTreeGridRowComponent;
    expanded: boolean;
    event: Event;
    cancel: boolean;
}
