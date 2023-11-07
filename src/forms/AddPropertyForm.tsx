import React from 'react';

export function AddPropertyForm(props: React.PropsWithChildren<{}>) {
  return (
    <form action="/api/properties" method="POST">
      <input type="hidden" name="method" value="POST" />
      <label key="type">
        <span>Type</span>
        <select name="type">
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
        />
      </label>
      <button type="submit">Add</button>
    </form>
  );
}