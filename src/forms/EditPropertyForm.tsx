import React from 'react';
import { Property } from '../types';

export function EditPropertyForm(props: React.PropsWithChildren<{ property: Property; }>) {
  return (
    <form action="/api/properties" method="POST">
      <input type="hidden" name="method" value="PUT" />
      <input type="hidden" name="id" value={props.property.id} />
      <input type="hidden" name="index" value={props.property.index} />
      <label key="type">
        <span>Type</span>
        <select name="type" defaultValue={props.property.type.constructor.name}>
          <option value="String">String</option>
          <option value="Number">Number</option>
          <option value="Boolean">Boolean</option>
        </select>
      </label>
      <label key="name">
        <span>Name</span>
        <input
          autoComplete="off"
          required
          type="text"
          name="name"
          placeholder="Name"
          value={props.property.name}
        />
      </label>
    </form>
  );
}