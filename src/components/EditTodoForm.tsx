import React from "react";
import {Todo} from '../types';

export function EditTodoForm(props: React.PropsWithChildren<{ todo: Todo; index: number; autofocus: boolean; }>) {
  return <>
    <form action="/api/todos/ui" method="POST" className="close-dialog-form" role="none">
      <input type="hidden" name="state" value="CLOSE_EDIT_TODO_DIALOG" />
      <input type="hidden" name="index" value={props.index} />
      <button className="button" type="submit" aria-label="Close">
        X
      </button>
    </form>
    <div className="modal-dialog-content" role="none">
      <h1>Edit Todo</h1>
      <form action="/api/todos" method="POST" className="inline-form" role="none">
        <input type="hidden" name="method" value="PUT" />
        <input type="hidden" name="id" value={props.todo.id} />
        <input type="hidden" name="completed" value={props.todo.completed ? 'on' : 'off'} />
        <label>
          <span>Title</span>
          <input
            autoComplete="off"
            data-auto-focus={props.autofocus}
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
    </div>
  </>;
}