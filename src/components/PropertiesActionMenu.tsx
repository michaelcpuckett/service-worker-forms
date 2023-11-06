import React from 'react';

export function PropertiesActionMenu(props: React.PropsWithChildren<{}>) {
  return (
    <details role="none">
      <summary 
        id="properties-action-menu-trigger"
        aria-controls="properties-action-menu"
        role="button"
        aria-haspopup="true">
        Edit Properties
      </summary>
      <div
        role="menu"
        id="properties-action-menu"
        aria-labelledby="properties-action-menu-trigger">
      </div>
    </details>
  );
}