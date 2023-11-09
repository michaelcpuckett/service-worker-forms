import React from "react";
import { Property, Row } from '../types';

export function UpdateRowCompletedForm(props: React.PropsWithChildren<{ row: Row, autofocus: boolean; properties: Property[]; }>) {
  return (
    <form action={`/api/databases/${props.row.databaseId}/rows/${props.row.id}/completed`} method="POST" data-auto-submit role="none">
      <input type="hidden" name="method" value="PUT" />
      <input
        data-auto-focus={props.autofocus}
        id={`edit-row-inline-form-field--${props.row.id}--completed`}
        name="completed"
        type="checkbox"
        checked={props.row.completed}
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