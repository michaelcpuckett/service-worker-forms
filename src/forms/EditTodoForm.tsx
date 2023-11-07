import React from 'react';
import {Property, Todo} from '../types';

export function EditTodoForm(props: React.PropsWithoutRef<{ todo: Todo; index: number; properties: Property[]; }>) {
  return (
    <form action={`/api/todos/${props.todo.id}`} method="POST" role="none">
      <input type="hidden" name="method" value="PUT" />
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
      {props.properties.map((property) => {
        return (
          <label>
            <span>{property.name}</span>
            <input
              key={property.id}
              type="text"
              name={`${property.id}`}
              placeholder={property.name}
              value={`${props.todo[property.id] || ''}`}
            />
          </label>
        );
      })}
      <button className="button" type="submit">
        Save
      </button>
    </form>
  );
}