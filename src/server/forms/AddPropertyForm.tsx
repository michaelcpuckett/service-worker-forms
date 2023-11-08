import React from 'react';

export function AddPropertyForm(props: React.PropsWithChildren<{}>) {
  return (
    <form action="/api/properties" method="POST">
      <input type="hidden" name="method" value="POST" />
      <input type="hidden" name="type" value="String" />
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
      <button className="button" type="submit">Add</button>
    </form>
  );
}