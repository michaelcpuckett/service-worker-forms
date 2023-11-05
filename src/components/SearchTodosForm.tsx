import React from 'react';
import {Referrer} from '../types';

export function SearchTodosForm(props: React.PropsWithoutRef<{ referrer: Referrer }>) {
  return (
    <form action="/api/search" method="POST">
      <div role="group" aria-label="Search Todos">
        <input type="hidden" name="method" value="POST" />
        <input autoFocus={props.referrer.state === 'SEARCH_TODOS'} type="search" name="query" value={props.referrer.query ?? ''} />
        <button type="submit">
          Search
        </button>
      </div>
    </form>
  )
}