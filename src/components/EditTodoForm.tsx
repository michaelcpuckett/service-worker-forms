import React from "react";
import {Todo, Referrer} from '../types';

export function EditTodoForm(props: React.PropsWithChildren<{ todo: Todo; index: number; referrer: Referrer; autofocus: boolean; }>) {
  return <>
    <form action="/api/todos/ui" method="POST" className="close-dialog-form">
      <input type="hidden" name="state" value="CLOSE_EDIT_TODO_DIALOG" />
      <input type="hidden" name="index" value={props.index} />
      <button type="submit" aria-label="Close">
        X
      </button>
    </form>
    <div className="modal-dialog-content">
      <form action="/api/todos" method="POST" className="inline-form">
        <input type="hidden" name="method" value="PUT" />
        <input type="hidden" name="id" value={props.todo.id} />
        <input type="hidden" name="completed" value={props.todo.completed ? 'on' : 'off'} />
        <label>
          <input
            autoComplete="off"
            autoFocus
            required
            type="text"
            name="title"
            placeholder="Title"
            value={props.todo.title}
            aria-label="Title"
          />
        </label>
        <button type="submit">
          Save
        </button>
      </form>
      <form action="/api/todos/ui" method="POST">
        <input type="hidden" name="state" value="CLOSE_EDIT_TODO_DIALOG" />
        <input type="hidden" name="index" value={props.index} />
        <button
          type="submit">
          Cancel
        </button>
      </form>
    </div>
  </>;
}