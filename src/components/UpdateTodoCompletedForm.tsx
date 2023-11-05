import React from "react";
import { Todo } from '../types';

export function UpdateTodoCompletedForm(props: React.PropsWithChildren<{ todo: Todo, autofocus: boolean }>) {
  return (
    <form action="/api/todos" method="POST" data-auto-submit>
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="id" value={props.todo.id} />
      <input type="hidden" name="title" value={props.todo.title} />
      <input
        autoFocus={props.autofocus}
        name="completed"
        type="checkbox"
        checked={props.todo.completed}
      />
      <noscript>
        <br />
        <button type="submit">
          Update
        </button>
      </noscript>
    </form>
  );
}