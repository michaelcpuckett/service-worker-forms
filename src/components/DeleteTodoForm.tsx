import React from 'react';
import { Todo } from '../types';

export function DeleteTodoForm(props: React.PropsWithChildren<{ todo: Todo; autofocus: boolean; index: number; }>) {
  return (
    <form action="/api/todos/ui" method="POST" role="none">
      <input type="hidden" name="state" value="CONFIRMING_DELETE_TODO" />
      <input type="hidden" name="index" value={props.index} />
      <button type="submit">Delete</button>
    </form>
  )
}