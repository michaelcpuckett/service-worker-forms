import React from "react";
import { Todo, Referrer } from '../types';
import { UpdateTodoCompletedForm } from './UpdateTodoCompletedForm';
import { ReorderTodoUpForm } from './ReorderTodoUpForm';
import { ReorderTodoDownForm } from './ReorderTodoDownForm';
import {TriggerTodoEditForm} from './TriggerTodoEditForm';
import {DeleteTodoForm} from './DeleteTodoForm';
import {SearchTodosForm} from './SearchTodosForm';
import {FilterTodos} from './FilterTodos';

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

  return (
    <section aria-label="Table View">
      {props.todos.length === 0 ? (
        <p>
        No todos yet. Add one above.
        </p>
      ) : <>
        <nav aria-label="Actions">
          <FilterTodos todos={props.todos} referrer={props.referrer} />
          <SearchTodosForm referrer={props.referrer} />
        </nav>
        <table className="table-view">
          <thead>
            <tr>
              <th>
                Done
              </th>
              <th>
                Title
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo, index, { length }) => (
              <tr
                aria-label={todo.title}
                data-completed={todo.completed ? '' : undefined}>
                <td>
                  <UpdateTodoCompletedForm todo={todo} autofocus={(['EDIT_TODO_COMPLETED'].includes(props.referrer.state) && index === (props.referrer.index ?? (length - 1)))} />
                </td>
                <td>
                  <span className="title" tabIndex={-1}>
                    {todo.title}
                  </span>
                </td>
                <td>
                  <details role="none">
                    <summary
                      id={`todos-actions-menu-trigger--${todo.id}`}
                      aria-controls={`todos-actions-menu--${todo.id}`}
                      role="button"
                      aria-label="Actions"
                      aria-haspopup="true"
                      autoFocus={['REORDER_TODO_UP', 'REORDER_TODO_DOWN', 'EDIT_TODO', 'CLOSE_EDIT_TODO_DIALOG', 'CLOSE_CONFIRM_DELETE_TODO_DIALOG'].includes(props.referrer.state) && index === props.referrer.index}>
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                      </svg>
                    </summary>
                    <div
                      role="menu"
                      id={`todos-actions-menu--${todo.id}`}
                      aria-labelledby={`todos-actions-menu-trigger--${todo.id}`}>
                      <ReorderTodoUpForm
                        todo={todo}
                        index={props.todos.findIndex(t => t.id === filteredTodos[index - 1]?.id)}
                        isDisabled={!filteredTodos[index - 1]}
                        role="menuitem"
                        tabindex={0}
                      />
                      <ReorderTodoDownForm
                        todo={todo}
                        index={props.todos.findIndex(t => t.id === filteredTodos[index + 1]?.id)}
                        isDisabled={!filteredTodos[index + 1]}
                        role="menuitem"
                        tabindex={-1}
                      />
                      <TriggerTodoEditForm
                        todo={todo}
                        index={index}
                        role="menuitem"
                        tabindex={-1}
                      />
                      <DeleteTodoForm
                        todo={todo}
                        index={index}
                        role="menuitem"
                        tabindex={-1}
                      />
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>}
    </section>
  );
}
