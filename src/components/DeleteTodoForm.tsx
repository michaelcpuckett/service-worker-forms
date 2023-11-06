import React from 'react';
import { Todo } from '../types';

export function DeleteTodoForm(props: React.PropsWithChildren<{ todo: Todo; autofocus?: boolean; index: number; role?: string; tabindex?: number; }>) {
  return (
    <form action="/api/todos/ui" method="POST" role="none">
      <input type="hidden" name="state" value="CONFIRMING_DELETE_TODO" />
      <input type="hidden" name="index" value={props.index} />
      <button
        data-auto-focus={props.autofocus}
        tabIndex={props.tabindex}
        role={props.role}
        type="submit">
        Delete
      </button>
    </form>
  )
}