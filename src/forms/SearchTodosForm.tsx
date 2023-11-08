import React from 'react';
import {Referrer} from '../types';

export function SearchTodosForm(props: React.PropsWithoutRef<{ referrer: Referrer }>) {
  return (
    <form action="/api/search" method="POST" role="none" data-auto-submit="delay">
      <div role="group" aria-label="Search Todos">
        <input type="hidden" name="method" value="POST" />
        <input id="search-todos-input" data-auto-focus={props.referrer.state === 'SEARCH_TODOS'} type="search" name="query" value={props.referrer.query ?? ''} />
        <button className="button" type="submit">
          Search
        </button>
      </div>
    </form>
  )
}