import React from "react";
import { Referrer, Todo, Property } from "../types";

export function AddTodoForm(props: React.PropsWithChildren<{ referrer: Referrer; todos: Todo[]; properties: Property[]; }>) {
  return (
    <form action="/api/todos" method="POST" className="inline-form" role="none">
      <div role="group" aria-label="New Todo">
        <input type="hidden" name="method" value="POST" />
        <label>
          <span>Title</span>
          <input
            autoComplete="off"
            required
            type="text"
            name="title"
            placeholder="Title"
          />
        </label>
        {props.properties.map((property) => {
          return (
            <label>
              <span>{property.name}</span>
              <input
                key={property.id}
                type="text"
                name={`${property.id}`}
                placeholder={property.name}
              />
            </label>
          );
        })}
        <button className="button" type="submit">Add</button>
      </div>
    </form>
  );
}