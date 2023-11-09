import React from 'react';
import {Property, Row} from '../types';

export function EditRowForm(props: React.PropsWithoutRef<{ row: Row; index: number; properties: Property[]; }>) {
  return (
    <form action={`/api/databases/${props.row.databaseId}/rows/${props.row.id}`} method="POST" role="none">
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
          value={props.row.title}
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
              value={`${props.row[property.id] || ''}`}
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