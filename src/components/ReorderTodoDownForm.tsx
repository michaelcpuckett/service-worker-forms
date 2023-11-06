import React from 'react';
import { Todo } from '../types';

export function ReorderTodoDownForm(props: React.PropsWithoutRef<{ todo: Todo; index: number; autofocus: boolean; isDisabled: boolean; role?: string; }>) {
  return (
    <form action="/api/todos" method="POST" role="none">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="id" value={props.todo.id} />
      <input type="hidden" name="title" value={props.todo.title} />
      <input type="hidden" name="completed" value={props.todo.completed ? 'on' : 'off'} />
      <input type="hidden" name="index" value={props.index} />
      <button
        role={props.role}
        type="submit"
        data-auto-focus={props.autofocus}
        disabled={props.isDisabled}>
        Move Down
      </button>
    </form>
  );
}