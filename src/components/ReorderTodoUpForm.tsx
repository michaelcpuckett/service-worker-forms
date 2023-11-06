import React from "react";
import { Todo } from "../types";

export function ReorderTodoUpForm(props: React.PropsWithChildren<{ todo: Todo; index: number; isDisabled: boolean; autofocus: boolean }>) {
  return (
    <form action="/api/todos" method="POST">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="id" value={props.todo.id} />
      <input type="hidden" name="title" value={props.todo.title} />
      <input
        type="hidden"
        name="completed"
        value={props.todo.completed ? "on" : "off"}
      />
      <input type="hidden" name="index" value={props.index} />
      <button
        disabled={props.isDisabled}
        type="submit"
        data-auto-focus={props.autofocus}
      >
        Move Up
      </button>
    </form>
  );
}