import React from "react";
import { Todo, Referrer } from './types';
import { UpdateTodoCompletedForm } from './UpdateTodoCompletedForm';
import { UpdateTodoTitleInlineForm } from './UpdateTodoTitleInlineForm';
import { ReorderTodoUpForm } from './ReorderTodoUpForm';
import { ReorderTodoDownForm } from './ReorderTodoDownForm';
import {TriggerTodoEditInlineForm} from './TriggerTodoEditInlineForm';
import {DeleteTodoForm} from './DeleteTodoForm';

export function TodosTableView(
  props: React.PropsWithoutRef<{ todos: Todo[], referrer: Referrer }>
) {
  const queriedTodos = props.todos.filter((todo) => {
    if (!props.referrer.query) {
      return true;
    }

    return todo.title.toLowerCase().includes(props.referrer.query.toLowerCase());
  });
  const filteredTodos = queriedTodos.filter((todo) => {
    switch (props.referrer.filter) {
      case 'completed':
        return todo.completed;
      case 'incompleted':
        return !todo.completed;
      default:
        return true;
    }
  });

  const allTodosUrl = new URL(props.referrer.url);
  allTodosUrl.searchParams.delete('filter');

  const completedTodosUrl = new URL(props.referrer.url);
  completedTodosUrl.searchParams.set('filter', 'completed');

  const incompleteTodosUrl = new URL(props.referrer.url);
  incompleteTodosUrl.searchParams.set('filter', 'incompleted');

  return (
    <section aria-label="Table View">
      <nav aria-label="Actions">
        <fieldset>
          <legend>Filter</legend>
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
        </fieldset>
        <form action="/api/search" method="POST">
          <fieldset>
            <legend>
              Search
            </legend>
            <input type="hidden" name="method" value="POST" />
            <input autoFocus={props.referrer.state === 'SEARCH_TODOS'} type="search" name="query" value={props.referrer.query ?? ''} />
            <button type="submit">
              Search
            </button>
          </fieldset>
        </form>
      </nav>
      {props.todos.length === 0 ? (
        <p>
        No todos yet. Add one above.
        </p>
      ) : (
        <table className="table-view">
          <tbody>
            {filteredTodos.map((todo, index, { length }) => (
              <tr
                aria-label={todo.title}
                data-completed={todo.completed ? '' : undefined}>
                <td>
                  <UpdateTodoCompletedForm todo={todo} autofocus={(props.referrer.state === 'EDIT_TODO_COMPLETED' && index === (props.referrer.index ?? (length - 1)))} />
                </td>
                <td>
                  {(props.referrer.state === 'EDITING_TODO' && index === (props.referrer.index ?? (length - 1))) ? (
                    <UpdateTodoTitleInlineForm todo={todo} autofocus={true} referrer={props.referrer} />
                  ) : (
                    <span className="title" tabIndex={-1}>
                      {todo.title}
                    </span>
                  )}
                </td>
                <td>
                  <details>
                    <summary autoFocus={['REORDER_TODO_UP', 'REORDER_TODO_DOWN', 'DELETE_TODO', 'EDIT_TODO_TITLE'].includes(props.referrer.state) && index === props.referrer.index}></summary>
                    <ul>
                      <li>
                        <ReorderTodoUpForm
                          todo={todo}
                          index={props.todos.findIndex(t => t.id === filteredTodos[index - 1]?.id)}
                          isDisabled={!filteredTodos[index - 1]}
                          autofocus={
                            (props.referrer.state === "REORDER_TODO_UP" &&
                              index === props.referrer.index) ||
                            (props.referrer.state === "REORDER_TODO_DOWN" &&
                              index === props.referrer.index &&
                              index === props.todos.length - 1)
                          }
                        />
                      </li>
                      <li>
                        <ReorderTodoDownForm
                          todo={todo}
                          index={props.todos.findIndex(t => t.id === filteredTodos[index + 1]?.id)}
                          isDisabled={!filteredTodos[index + 1]}
                          autofocus={(props.referrer.state === 'REORDER_TODO_DOWN' && index === props.referrer.index) || (props.referrer.state === 'REORDER_TODO_UP' && index === 0 && props.referrer.index === 0)}
                        />
                      </li>
                      <li>
                        <TriggerTodoEditInlineForm
                          autofocus={(props.referrer.state === 'EDIT_TODO_TITLE' && index === (props.referrer.index ?? (length - 1)))}
                          todo={todo}
                          index={index}
                        />
                      </li>
                      <li>
                        <DeleteTodoForm todo={todo} autofocus={(props.referrer.state === 'DELETE_TODO' && index === Math.min(length - 1, Math.max(0, (props.referrer.index ?? length))))} />
                      </li>
                    </ul>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
