import React from 'react';
import {Referrer} from '../types';

export function SearchRowsForm(props: React.PropsWithoutRef<{ referrer: Referrer }>) {
  return (
    <form action="/api/search" method="POST" role="none" data-auto-submit="delay">
      <div role="group" aria-label="Search Rows">
        <input type="hidden" name="method" value="POST" />
        <input id="search-rows-input" data-auto-focus={props.referrer.state === 'SEARCH_ROWS'} type="search" name="query" value={props.referrer.query ?? ''} />
        <button className="button" type="submit">
          Search
        </button>
      </div>
    </form>
  )
}