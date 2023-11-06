import React from "react";
import { Todo } from "../types";

export function TriggerTodoEditInlineForm(props: React.PropsWithChildren<{ todo: Todo; index: number; autofocus: boolean; }>) {
  return (
    <form action="/api/todos/ui" method="POST">
      <input type="hidden" name="state" value="EDITING_TODO" />
      <input type="hidden" name="index" value={props.index} />
      <button
        type="submit"
        data-auto-focus={props.autofocus}>
        Edit
      </button>
    </form>
  )
}