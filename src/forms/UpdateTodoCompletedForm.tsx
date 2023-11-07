import React from "react";
import { Property, Todo } from '../types';

export function UpdateTodoCompletedForm(props: React.PropsWithChildren<{ todo: Todo, autofocus: boolean; properties: Property[]; }>) {
  return (
    <form action={`/api/todos/${props.todo.id}/completed`} method="POST" data-auto-submit role="none">
      <input type="hidden" name="method" value="PUT" />
      <input
        data-auto-focus={props.autofocus}
        name="completed"
        type="checkbox"
        checked={props.todo.completed}
      />
      <noscript>
        <br />
        <button className="button" type="submit">
          Update
        </button>
      </noscript>
    </form>
  );
}