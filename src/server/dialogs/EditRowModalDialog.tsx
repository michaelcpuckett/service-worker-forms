import React from "react";
import {Property, Row} from '../types';
import {ModalDialog} from './ModalDialog';
import {EditRowForm} from '../forms/EditRowForm';

export function EditRowModalDialog(props: React.PropsWithChildren<{ row: Row; index: number; properties: Property[]; }>) {
  return (
    <ModalDialog
      open
      closeButtonData={{
        state: 'CLOSE_EDIT_ROW_DIALOG',
        index: props.index,
      }}
      heading={<>Edit Row</>}>
      <EditRowForm row={props.row} index={props.index} properties={props.properties} />
      <form action="/api/rows/ui" method="POST" role="none">
        <input type="hidden" name="state" value="CLOSE_EDIT_ROW_DIALOG" />
        <input type="hidden" name="index" value={props.index} />
        <button
          className="button"
          type="submit">
          Cancel
        </button>
      </form>
    </ModalDialog>
  );
}