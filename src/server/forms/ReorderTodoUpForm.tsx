import React from "react";
import { Todo } from "../types";

export function ReorderTodoUpForm(props: React.PropsWithChildren<{ todo: Todo; index: number; isDisabled?: boolean; autofocus?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action={`/api/todos/${props.todo.id}`}  method="POST" role="none">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="title" value={props.todo.title} />
      <input
        type="hidden"
        name="completed"
        value={props.todo.completed ? "on" : "off"}
      />
      <input type="hidden" name="index" value={props.index} />
      <button
        className="button"
        tabIndex={props.tabindex}
        role={props.role}
        type={props.isDisabled ? 'button' : 'submit'}
        data-auto-focus={props.autofocus}
        aria-disabled={props.isDisabled}>
        Move Up
      </button>
    </form>
  );
}
