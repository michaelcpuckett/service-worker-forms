import React from 'react';
import {Referrer} from '../types';

export function FilterTodos(props: React.PropsWithoutRef<{ todos: Todo[]; referrer: Referrer }>) {
  const allTodosUrl = new URL(props.referrer.url);
  allTodosUrl.searchParams.delete('filter');

  const completedTodosUrl = new URL(props.referrer.url);
  completedTodosUrl.searchParams.set('filter', 'completed');

  const incompleteTodosUrl = new URL(props.referrer.url);
  incompleteTodosUrl.searchParams.set('filter', 'incompleted');
  
  return (
    <div role="group" aria-label="Filter Todos">
      <ul className="no-bullet">
        <li>
          <a
            aria-current={!props.referrer.filter ? 'page' : undefined}
            href={allTodosUrl.href}>All ({props.todos.length})</a>
        </li>
        <li>
          <a
            aria-current={props.referrer.filter === 'incompleted' ? 'page' : undefined}
            href={incompleteTodosUrl.href}>Incomplete ({props.todos.filter((todo) => !todo.completed).length})</a>
        </li>
        <li>
          <a
            aria-current={props.referrer.filter === 'completed' ? 'page' : undefined}
            href={completedTodosUrl.href}>Completed ({props.todos.filter((todo) => todo.completed).length})</a>
        </li>
      </ul>
    </div>
  );
}