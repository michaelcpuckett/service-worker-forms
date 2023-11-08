import React from "react";
import { Todo, Property, Referrer } from '../types';
import { UpdateTodoCompletedForm } from '../forms/UpdateTodoCompletedForm';
import {SearchTodosForm} from '../forms/SearchTodosForm';
import {FilterTodos} from './FilterTodos';
import {TodoActionsMenu} from '../menus/TodoActionsMenu';

export function TodosTableView(
  props: React.PropsWithoutRef<{ todos: Todo[], referrer: Referrer; properties: Property[]; }>
) {
  const queriedTodos = props.todos.filter((todo) => {
    if (!props.referrer.query) {
      return true;
    }

    const allStringProperties = [
      'title',
      ...props.properties.map((property) => property.id),
    ]

    return allStringProperties.find((stringProperty) => {
      if (!props.referrer.query) {
        return false;
      }

      return todo[stringProperty].toLowerCase().includes(props.referrer.query.toLowerCase());
    });
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

  const gridColumnsCss = `auto minmax(0, 1fr) ${props.properties.length ? `repeat(${props.properties.length}, minmax(0, 1fr))` : ''} auto`;

  return (
    <section aria-label="Table View">
      {props.todos.length === 0 ? (
        <p>
          No todos yet. Add one below.
        </p>
      ) : null}
      <nav aria-label="Actions">
        <FilterTodos todos={props.todos} referrer={props.referrer} />
        <SearchTodosForm referrer={props.referrer} />
      </nav>
      <table className="table-view" style={{
        '--grid-columns': gridColumnsCss,
      }}>
        <thead>
          <tr>
            <th>
              Done
            </th>
            <th>
              Title
            </th>
            {props.properties.map((property) => (
              <th>
                {property.name}
              </th>
            ))}
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
                    properties={props.properties}
                    autofocus={(['EDIT_TODO_COMPLETED'].includes(props.referrer.state) && index === (props.referrer.index ?? (length - 1)))}
                  />
                </td>
                <td>
                  <input
                    form={`edit-todo-inline-form--${todo.id}`}
                    id={`edit-todo-inline-form-field--${todo.id}--title`}
                    autoComplete="off"
                    aria-label="Title"
                    type="text"
                    className="contenteditable title"
                    name="title"
                    value={todo.title}
                  />
                  <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="-2.5 0 19 19">
                    <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                  </svg>
                </td>
                {props.properties.map((property) => {
                  const value = 
                    ((typeof todo[property.id] === 'boolean' && property.name !== 'completed') ? (todo[property.id] ? 'Yes' : 'No') : '') ||
                    (typeof todo[property.id] === 'string' && `${todo[property.id]}`) ||
                    (typeof todo[property.id] === 'number' && property.name !== 'id' && `${todo[property.id]}`) || '';
                  
                  return (
                    <td>
                      <input
                        id={`edit-todo-inline-form-field--${todo.id}--${property.id}`}
                        autoComplete="off"
                        aria-label={property.name}
                        form={`edit-todo-inline-form--${todo.id}`}
                        type="text" name={`${property.id}`}
                        className="contenteditable"
                        value={value}
                      />
                      <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="-2.5 0 19 19">
                        <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                      </svg>
                    </td>
                  );
                })}
                <td aria-label={`Actions for ${todo.title}`}>
                  <form method="POST" action={`/api/todos/${todo.id}`} id={`edit-todo-inline-form--${todo.id}`} role="none">
                    <input type="hidden" name="method" value="PUT" />
                    <button type="submit" hidden>
                      Update
                    </button>
                  </form>
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
          <tr>
            <td>
              <input
                name="completed"
                type="checkbox"
                aria-label="Completed"
                form="add-todo-form"
              />
            </td>
            <td>
              <input
                aria-label="Title"
                autoComplete="off"
                required
                type="text"
                name="title"
                form="add-todo-form"
                placeholder="Title"
                className="contenteditable"
                data-auto-focus={props.referrer.state === 'ADD_TODO'}
                value=""
              />
              <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="-2.5 0 19 19">
                <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
              </svg>
            </td>
            {props.properties.map((property) => {
              return (
                <td>
                  <input
                    aria-label={property.name}
                    autoComplete="off"
                    className="contenteditable"
                    form="add-todo-form"
                    key={property.id}
                    type="text"
                    name={`${property.id}`}
                    placeholder={property.name}
                    value=""
                  />
                  <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="-2.5 0 19 19">
                    <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                  </svg>
                </td>
              );
            })}
            <td>
              <form action="/api/todos" method="POST" role="none" id="add-todo-form">
                <input type="hidden" name="method" value="POST" />
                <button type="submit" className="button">
                  Add
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
