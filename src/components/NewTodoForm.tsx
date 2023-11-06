import React from "react";
import { Referrer, Todo } from "../types";

export function NewTodoForm(props: React.PropsWithChildren<{ referrer: Referrer; todos: Todo[]; }>) {
  return (
    <form action="/api/todos" method="POST" className="inline-form" role="none">
      <div role="group" aria-label="New Todo">
        <input type="hidden" name="method" value="POST" />
        <label>
          <input required aria-label="Title" autoComplete="off" data-auto-focus={((props.referrer.state === 'DELETE_TODO' && props.todos?.length === 0) || (props.referrer.state === 'ADD_TODO')) ? true : undefined} type="text" name="title" placeholder="Title" />
        </label>
        <button className="button" type="submit">Add</button>
      </div>
    </form>
  );
}