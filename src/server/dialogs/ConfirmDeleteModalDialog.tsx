import React from 'react';
import { Row, Referrer } from '../types';
import { ModalDialog } from './ModalDialog';

export function ConfirmDeleteModalDialog(props: React.PropsWithChildren<{ row: Row; rows: Row[]; referrer: Referrer; index: number; }>) {
  return (
    <ModalDialog
      open
      closeButtonData={{
        state: 'CLOSE_CONFIRM_DELETE_ROW_DIALOG',
        index: props.referrer.index || 0,
      }}
      heading={<>Confirm Delete Row</>}>
      <p>Are you sure you want to delete this row?</p>
      <blockquote>
        <strong>{props.row.title}</strong>
      </blockquote>
      <form action={`/api/databases/${props.row.databaseId}/rows/${props.row.id}`} method="POST" role="none">
        <input type="hidden" name="method" value="DELETE" />
        <button className="button" type="submit" data-auto-focus="true">
          Delete
        </button>
      </form>
      <form action="/api/rows/ui" method="POST" role="none">
        <input type="hidden" name="state" value="CLOSE_CONFIRM_DELETE_ROW_DIALOG" />
        <input type="hidden" name="index" value={props.referrer.index} />
        <button className="button" type="submit">Cancel</button>
      </form>
    </ModalDialog>
  );
}