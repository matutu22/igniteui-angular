import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxTreeGridAPIService } from './tree-grid-api.service';
import { IgxTreeGridComponent } from './tree-grid.component';
import { IgxTreeGridRowComponent } from './tree-grid-row.component';
import { IgxChipsModule } from '../chips/chips.module';
import { IgxGridCommonModule } from '../grid-common/common/grid-common.module';

@NgModule({
  declarations: [
    IgxTreeGridComponent,
    IgxTreeGridRowComponent
  ],
  exports: [
    IgxTreeGridComponent,
    IgxTreeGridRowComponent,
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
