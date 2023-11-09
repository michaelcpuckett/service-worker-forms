import React from 'react';
import { Row, Referrer } from '../types';
import { FlyoutMenu } from './FlyoutMenu';
import { ReorderRowUpForm } from '../forms/ReorderRowUpForm';
import { ReorderRowDownForm } from '../forms/ReorderRowDownForm';
import {TriggerEditRowForm} from '../forms/TriggerEditRowForm';
import {DeleteRowForm} from '../forms/DeleteRowForm';

export function RowActionsMenu(props: React.PropsWithChildren<{ row: Row; rows: Row[]; filteredRows: Row[]; filteredIndex: number; index: number; referrer: Referrer; }>) {
  return (
    <flyout-menu>
      <template shadowrootmode="open">
        <link rel="stylesheet" href="/flyout-menu.css" />
        <FlyoutMenu
          id={`${props.row.id}`}
          label={props.row.title}
          autofocus={['REORDER_ROW_UP', 'REORDER_ROW_DOWN', 'EDIT_ROW', 'CLOSE_EDIT_ROW_DIALOG', 'CLOSE_CONFIRM_DELETE_ROW_DIALOG'].includes(props.referrer.state) && props.index === props.referrer.index}
        />
      </template>

      <ReorderRowUpForm
        row={props.row}
        index={props.rows.findIndex((t) => t.id === props.filteredRows[props.filteredIndex - 1]?.id)}
        isDisabled={!props.filteredRows[props.filteredIndex - 1]}
        role="menuitem"
        tabindex={0}
      />
      <ReorderRowDownForm
        row={props.row}
        index={props.rows.findIndex((t) => t.id === props.filteredRows[props.filteredIndex + 1]?.id)}
        isDisabled={!props.filteredRows[props.filteredIndex + 1]}
        role="menuitem"
        tabindex={-1}
      />
      <TriggerEditRowForm
        row={props.row}
        index={props.index}
        role="menuitem"
        tabindex={-1}
      />
      <DeleteRowForm
        row={props.row}
        index={props.index}
        role="menuitem"
        tabindex={-1}
      />
    </flyout-menu>
  );
}