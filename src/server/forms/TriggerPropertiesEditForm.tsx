import React from "react";

export function TriggerPropertiesEditForm(props: React.PropsWithChildren<{ autofocus?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action="/api/rows/ui" method="POST" role="none">
      <input type="hidden" name="state" value="EDITING_PROPERTIES" />
      <button
        className="button"
        tabIndex={props.tabindex}
        role={props.role}
        type="submit"
        data-auto-focus={props.autofocus}>
        Edit Properties
      </button>
    </form>
  )
}