import React from "react";
import { Referrer, Todo, Property } from "../types";

export function AddTodoForm(props: React.PropsWithChildren<{ referrer: Referrer; todos: Todo[]; properties: Property[]; autofocus?: boolean; }>) {
  return (
    <form action="/api/todos" method="POST" className="inline-form" aria-label="New Todo">
      <input type="hidden" name="method" value="POST" />
      <input
        aria-label="Title"
        autoComplete="off"
        required
        type="text"
        name="title"
        placeholder="Title"
        className="contenteditable"
        data-auto-focus={props.autofocus}
      />
      {props.properties.map((property) => {
        return (
          <input
            aria-label={property.name}
            autoComplete="off"
            className="contenteditable"
            key={property.id}
            type="text"
            name={`${property.id}`}
            placeholder={property.name}
          />
        );
      })}
      <button className="button" type="submit">Add</button>
    </form>
  );
}