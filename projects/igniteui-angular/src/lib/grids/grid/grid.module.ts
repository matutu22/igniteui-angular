import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IgxGridAPIService } from './grid-api.service';
import {
    IgxGroupAreaDropDirective,
    IgxGroupByRowTemplateDirective
} from './grid.directives';
import { IgxGridComponent } from './grid.component';
import {
    IgxGridPagingPipe,
    IgxGridPostGroupingPipe,
    IgxGridPreGroupingPipe,
    IgxGridSortingPipe,
    IgxGridFilteringPipe,
    IgxGridHierarchicalPipe
} from './grid.pipes';
import { IgxGridGroupByRowComponent } from './groupby-row.component';
import { IgxGridRowComponent } from './grid-row.component';
import { IgxChipsModule } from '../../chips/chips.module';
import { IgxGridCommonModule } from '../grid-common.module';
import { DeprecateMethod } from '../../core/deprecateDecorators';
import { IgxHierarchicalRowComponent } from './hierarchical-row.component';
import { IgxChildLayoutComponent } from './igx-layout.component';
import { IgxChildGridRowComponent } from './child-grid-row.component';


@NgModule({
  declarations: [
    IgxGridComponent,
    IgxGridRowComponent,
    IgxGridGroupByRowComponent,
    IgxGroupByRowTemplateDirective,
    IgxGroupAreaDropDirective,
    IgxGridPreGroupingPipe,
    IgxGridPostGroupingPipe,
    IgxGridPagingPipe,
    IgxGridSortingPipe,
    IgxGridFilteringPipe,
    IgxGridHierarchicalPipe,
    IgxHierarchicalRowComponent,
    IgxChildGridRowComponent,
    IgxChildLayoutComponent,
  ],
  exports: [
    IgxGridComponent,
    IgxGridGroupByRowComponent,
    IgxGridRowComponent,
    IgxGroupByRowTemplateDirective,
    IgxGroupAreaDropDirective,
    IgxGridCommonModule,
    IgxHierarchicalRowComponent,
    IgxChildLayoutComponent,
    IgxChildGridRowComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IgxChipsModule,
    IgxGridCommonModule
  ]
})
export class IgxGridModule {
  @DeprecateMethod('IgxGridModule.forRoot method is deprecated. Use IgxGridModule instead.')
  public static forRoot() {
    return {
        ngModule: IgxGridModule
    };
  }
}
