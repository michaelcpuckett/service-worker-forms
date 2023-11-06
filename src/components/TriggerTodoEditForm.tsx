import React from "react";
import { Todo } from "../types";

export function TriggerTodoEditForm(props: React.PropsWithChildren<{ todo: Todo; index: number; autofocus?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action="/api/todos/ui" method="POST" role="none">
      <input type="hidden" name="state" value="EDITING_TODO" />
      <input type="hidden" name="index" value={props.index} />
      <button
        className="button"
        tabIndex={props.tabindex}
        role={props.role}
        type="submit"
        data-auto-focus={props.autofocus}>
        Edit
      </button>
    </form>
  )
}