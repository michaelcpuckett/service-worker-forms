import React from "react";
import { Todo, Referrer } from '../types';
import { UpdateTodoCompletedForm } from './UpdateTodoCompletedForm';
import {SearchTodosForm} from './SearchTodosForm';
import {FilterTodos} from './FilterTodos';
import {TodoActionsMenu} from '../menus/TodoActionsMenu';

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
            {props.todos.map((todo, index, { length }) => {
              const filteredIndex = filteredTodos.findIndex((t) => t.id === todo.id);

              if (filteredIndex === -1) {
                return null;
              }

              return (
                <tr
                  aria-label={todo.title}
                  data-completed={todo.completed ? '' : undefined}>
                  <td>
                    <UpdateTodoCompletedForm
                      todo={todo}
                      autofocus={(['EDIT_TODO_COMPLETED'].includes(props.referrer.state) && index === (props.referrer.index ?? (length - 1)))}
                    />
                  </td>
                  <td>
                    <span className="title">
                      {todo.title}
                    </span>
                  </td>
                  <td>
                    <TodoActionsMenu
                      todo={todo}
                      todos={props.todos}
                      index={index}
                      filteredIndex={filteredIndex}
                      filteredTodos={filteredTodos}
                      referrer={props.referrer}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>}
    </section>
  );
}
