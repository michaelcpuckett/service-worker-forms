import React from 'react';
import { Referrer } from '../types';

export function AddDatabaseForm() {
  return (
    <form action="/api/databases" method="POST">
      <input type="hidden" name="method" value="POST" />
      <input type="text" name="name" placeholder="Name" required />
      <select name="type" required>
        <option value="checklist">Checklist</option>
      </select>
      <button type="submit" className="button">Add Database</button>
    </form>
  );
}
