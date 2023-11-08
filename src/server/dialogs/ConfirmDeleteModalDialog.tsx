import React from 'react';
import { Todo, Referrer } from '../types';
import { ModalDialog } from './ModalDialog';

export function ConfirmDeleteModalDialog(props: React.PropsWithChildren<{ todo: Todo; todos: Todo[]; referrer: Referrer; index: number; }>) {
  return (
    <ModalDialog
      open
      closeButtonData={{
        state: 'CLOSE_CONFIRM_DELETE_TODO_DIALOG',
        index: props.referrer.index || 0,
      }}
      heading={<>Confirm Delete Todo</>}>
      <p>Are you sure you want to delete this todo?</p>
      <blockquote>
        <strong>{props.todo.title}</strong>
      </blockquote>
      <form action={`/api/todos/${props.todo.id}`} method="POST" role="none">
        <input type="hidden" name="method" value="DELETE" />
        <button className="button" type="submit" data-auto-focus="true">
          Delete
        </button>
      </form>
      <form action="/api/todos/ui" method="POST" role="none">
        <input type="hidden" name="state" value="CLOSE_CONFIRM_DELETE_TODO_DIALOG" />
        <input type="hidden" name="index" value={props.referrer.index} />
        <button className="button" type="submit">Cancel</button>
      </form>
    </ModalDialog>
  );
}