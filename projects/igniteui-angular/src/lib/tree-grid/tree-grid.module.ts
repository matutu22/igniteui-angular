import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
// import {
//     IgxCellEditorTemplateDirective,
//     IgxCellFooterTemplateDirective,
//     IgxCellHeaderTemplateDirective,
//     IgxCellTemplateDirective,
//     IgxGroupAreaDropDirective,
//     IgxGroupByRowTemplateDirective
// } from './grid.misc';
import { IgxTreeGridComponent } from './tree-grid.component';
// import {
//     IgxGridPagingPipe,
//     IgxGridPostGroupingPipe,
//     IgxGridPreGroupingPipe
// } from './grid.pipes';
import { IgxTreeGridRowComponent } from './tree-grid-row.component';
import { IgxChipsModule } from '../chips/chips.module';
import { IgxGridCommonModule } from '../grid-common/common/grid-common.module';

@NgModule({
  declarations: [
    IgxTreeGridComponent,
    IgxTreeGridRowComponent,
    // IgxCellFooterTemplateDirective,
    // IgxCellHeaderTemplateDirective,
    // IgxCellEditorTemplateDirective,
    // IgxCellTemplateDirective
  ],
  exports: [
    IgxTreeGridComponent,
    IgxTreeGridRowComponent,
    // IgxCellFooterTemplateDirective,
    // IgxCellHeaderTemplateDirective,
    // IgxCellEditorTemplateDirective,
    // IgxCellTemplateDirective,
    IgxGridCommonModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    IgxChipsModule,
    IgxGridCommonModule.forRoot(IgxTreeGridAPIService)
  ]
})
export class IgxTreeGridModule {
    public static forRoot() {
        return {
            ngModule: IgxTreeGridModule
        };
    }
}
