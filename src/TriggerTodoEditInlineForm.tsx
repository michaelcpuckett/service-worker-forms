import React from "react";
import { Todo } from "./types";

export function TriggerTodoEditInlineForm(props: React.PropsWithChildren<{ todo: Todo; index: number; autofocus: boolean; }>) {
  return (
    <a
      href={`?state=EDITING_TODO&index=${props.index}`}
      role="button"
      autoFocus={props.autofocus}>
      Edit
    </a>
  )
}