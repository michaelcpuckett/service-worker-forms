import React from 'react';
import { Todo } from '../types';

export function ReorderTodoDownForm(props: React.PropsWithoutRef<{ todo: Todo; index: number; autofocus?: boolean; isDisabled?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action="/api/todos" method="POST" role="none">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="id" value={props.todo.id} />
      <input type="hidden" name="title" value={props.todo.title} />
      <input type="hidden" name="completed" value={props.todo.completed ? 'on' : 'off'} />
      <input type="hidden" name="index" value={props.index} />
      <button
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