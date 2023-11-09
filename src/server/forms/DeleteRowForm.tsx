import React from 'react';
import { Row } from '../types';

export function DeleteRowForm(props: React.PropsWithChildren<{ row: Row; autofocus?: boolean; index: number; role?: string; tabindex?: number; }>) {
  return (
    <form action="/api/rows/ui" method="POST" role="none">
      <input type="hidden" name="state" value="CONFIRMING_DELETE_ROW" />
      <input type="hidden" name="index" value={props.index} />
      <button
        className="button"
        data-auto-focus={props.autofocus}
        tabIndex={props.tabindex}
        role={props.role}
        type="submit">
        Delete
      </button>
    </form>
  )
}