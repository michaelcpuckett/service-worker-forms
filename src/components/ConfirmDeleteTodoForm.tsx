import React from 'react';
import {Todo, Referrer} from '../types';

export function ConfirmDeleteTodoForm(
  props: React.PropsWithoutRef<{
    todo: Todo;
    autofocus?: boolean;
    referrer: Referrer;
  }>
) {
  return <>
    <form action="/api/todos/ui" method="POST" className="close-dialog-form" role="none">
      <input type="hidden" name="state" value="CLOSE_CONFIRM_DELETE_TODO_DIALOG" />
      <input type="hidden" name="index" value={props.referrer.index} />
      <button className="button" type="submit" aria-label="Close dialog">X</button>
    </form>
    <div className="modal-dialog-content" role="none">
      <h1>Confirm Delete Todo</h1>
      <p>Are you sure you want to delete this todo?</p>
      <blockquote>
        <strong>{props.todo.title}</strong>
      </blockquote>
      <form action="/api/todos" method="POST" role="none">
        <input type="hidden" name="method" value="DELETE" />
        <input type="hidden" name="id" value={props.todo.id} />
        <button className="button" type="submit" data-auto-focus={props.autofocus}>
          Delete
        </button>
      </form>
      <form action="/api/todos/ui" method="POST" role="none">
        <input type="hidden" name="state" value="CLOSE_CONFIRM_DELETE_TODO_DIALOG" />
        <input type="hidden" name="index" value={props.referrer.index} />
        <button className="button" type="submit">Cancel</button>
      </form>
    </div>
  </>;
}