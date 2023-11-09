import React from 'react';
import { Row } from '../types';

export function ReorderRowDownForm(props: React.PropsWithoutRef<{ row: Row; index: number; autofocus?: boolean; isDisabled?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action={`/api/databases/${props.row.databaseId}/rows/${props.row.id}`} method="POST" role="none">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="title" value={props.row.title} />
      <input type="hidden" name="completed" value={props.row.completed ? 'on' : 'off'} />
      <input type="hidden" name="index" value={props.index} />
      <button
        className="button"
        tabIndex={props.tabindex}
        role={props.role}
        type={props.isDisabled ? 'button' : 'submit'}
        data-auto-focus={props.autofocus}
        aria-disabled={props.isDisabled}>
        Move Down
      </button>
    </form>
  );
}