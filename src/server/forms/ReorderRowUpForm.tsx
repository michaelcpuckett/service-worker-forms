import React from "react";
import { Row } from "../types";

export function ReorderRowUpForm(props: React.PropsWithChildren<{ row: Row; index: number; isDisabled?: boolean; autofocus?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action={`/api/databases/${props.row.databaseId}/rows/${props.row.id}`}  method="POST" role="none">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="title" value={props.row.title} />
      <input
        type="hidden"
        name="completed"
        value={props.row.completed ? "on" : "off"}
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
