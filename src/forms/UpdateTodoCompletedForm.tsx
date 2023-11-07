import React from "react";
import { Property, Todo } from '../types';

export function UpdateTodoCompletedForm(props: React.PropsWithChildren<{ todo: Todo, autofocus: boolean; properties: Property[]; }>) {
  return (
    <form action="/api/todos" method="POST" data-auto-submit role="none">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="id" value={props.todo.id} />
      <input type="hidden" name="title" value={props.todo.title} />
      {props.properties.map((property) => {
        return (
          <input
            key={property.id}
            type="hidden"
            name={`${property.id}`}
            value={`${props.todo[property.id]}`}
          />
        );
      })}
      <input
        data-auto-focus={props.autofocus}
        name="completed"
        type="checkbox"
        checked={props.todo.completed}
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