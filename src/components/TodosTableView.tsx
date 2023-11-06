import React from "react";
import { Todo, Referrer } from '../types';
import { UpdateTodoCompletedForm } from './UpdateTodoCompletedForm';
import { ReorderTodoUpForm } from './ReorderTodoUpForm';
import { ReorderTodoDownForm } from './ReorderTodoDownForm';
import {TriggerTodoEditInlineForm} from './TriggerTodoEditInlineForm';
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
                Completed
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
                    </summary>
                    <ul 
                      role="menu"
                      id={`todos-actions-menu--${todo.id}`}
                      aria-labelledby={`todos-actions-menu--${todo.id}`}>
                      <li role="menuitem">
                        <ReorderTodoUpForm
                          todo={todo}
                          index={props.todos.findIndex(t => t.id === filteredTodos[index - 1]?.id)}
                          isDisabled={!filteredTodos[index - 1]}
                          autofocus={false}
                        />
                      </li>
                      <li role="menuitem">
                        <ReorderTodoDownForm
                          todo={todo}
                          index={props.todos.findIndex(t => t.id === filteredTodos[index + 1]?.id)}
                          isDisabled={!filteredTodos[index + 1]}
                          autofocus={false}
                        />
                      </li>
                      <li role="menuitem">
                        <TriggerTodoEditInlineForm
                          autofocus={false}
                          todo={todo}
                          index={index}
                        />
                      </li>
                      <li role="menuitem">
                        <DeleteTodoForm
                          todo={todo}
                          index={index}
                          autofocus={false}
                        />
                      </li>
                    </ul>
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
