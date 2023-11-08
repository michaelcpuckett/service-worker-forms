import React from "react";
import {Property, Todo} from '../types';
import {ModalDialog} from './ModalDialog';
import {EditTodoForm} from '../forms/EditTodoForm';

export function EditTodoModalDialog(props: React.PropsWithChildren<{ todo: Todo; index: number; properties: Property[]; }>) {
  return (
    <ModalDialog
      open
      closeButtonData={{
        state: 'CLOSE_EDIT_TODO_DIALOG',
        index: props.index,
      }}
      heading={<>Edit Todo</>}>
      <EditTodoForm todo={props.todo} index={props.index} properties={props.properties} />
      <form action="/api/todos/ui" method="POST" role="none">
        <input type="hidden" name="state" value="CLOSE_EDIT_TODO_DIALOG" />
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