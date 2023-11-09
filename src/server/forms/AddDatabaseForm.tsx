import React from 'react';
import { Referrer } from '../types';

export function AddDatabaseForm() {
  return (
    <form action="/api/databases" method="POST">
      <input type="hidden" name="method" value="POST" />
      <input type="text" name="name" placeholder="Name" required />
      <select name="type" required>
        <option value="checklist">Checklist</option>
        <option value="table">Table</option>
        <option value="list">List</option>
        <option value="calendar">Calendar</option>
        <option value="board">Board</option>
      </select>
      <button type="submit" className="button">Add Database</button>
    </form>
  );
}
