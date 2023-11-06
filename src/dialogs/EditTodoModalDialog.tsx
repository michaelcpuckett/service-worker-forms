import React from "react";
import {Todo} from '../types';
import {ModalDialog} from './ModalDialog';

export function EditTodoModalDialog(props: React.PropsWithChildren<{ todo: Todo; index: number; }>) {
  return (
    <ModalDialog
      open
      closeButtonData={{
        state: 'CLOSE_EDIT_TODO_DIALOG',
        index: props.index,
      }}
      heading={<>Edit Todo</>}>
      <form action="/api/todos" method="POST" className="inline-form" role="none">
        <input type="hidden" name="method" value="PUT" />
        <input type="hidden" name="id" value={props.todo.id} />
        <input type="hidden" name="completed" value={props.todo.completed ? 'on' : 'off'} />
        <label>
          <span>Title</span>
          <input
            autoComplete="off"
            data-auto-focus="true"
            required
            type="text"
            name="title"
            placeholder="Title"
            value={props.todo.title}
          />
        </label>
        <button className="button" type="submit">
          Save
        </button>
      </form>
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