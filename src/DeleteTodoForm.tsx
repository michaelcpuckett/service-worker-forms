import React from 'react';
import { Todo } from './types';

export function DeleteTodoForm(props: React.PropsWithChildren<{ todo: Todo; autofocus: boolean; }>) {
  return (
    <form action="/api/todos" method="POST">
      <input type="hidden" name="method" value="DELETE" />
      <input type="hidden" name="id" value={props.todo.id} />
      <button type="submit" autoFocus={props.autofocus}>
        Delete
      </button>
    </form>
  )
}