import React from "react";
import { Row } from "../types";

export function TriggerEditRowForm(props: React.PropsWithChildren<{ row: Row; index: number; autofocus?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action="/api/rows/ui" method="POST" role="none">
      <input type="hidden" name="state" value="EDITING_ROW" />
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