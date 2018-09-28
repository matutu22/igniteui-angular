import { GridBaseAPIService } from '../grid-common/api.service';
import { IgxTreeGridComponent } from './tree-grid.component';

import { cloneArray } from '../core/utils';
import { DataUtil } from '../data-operations/data-util';
import { ISortingExpression, SortingDirection } from '../data-operations/sorting-expression.interface';

export class IgxTreeGridAPIService extends GridBaseAPIService<IgxTreeGridComponent> {
    public on_after_content_init(id: string) {
        // const grid = this.get(id);
        // if (grid.groupTemplate) {
        //     grid.groupRowTemplate = grid.groupTemplate.template;
        // }

        super.on_after_content_init(id);
    }
}
