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

  const gridColumnsCss = `auto minmax(0, 1fr) ${props.properties.length ? `repeat(${props.properties.length}, minmax(0, 1fr))` : ''} auto`;

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
                    <form method="POST" action="/api/todos">
                      <input type="hidden" name="method" value="PUT" />
                      <input type="hidden" name="id" value={todo.id} />
                      {props.properties.map((property) => (
                        <input type="hidden" name={`${property.id}`} value={`${todo[property.id] || ''}`} />
                      ))}                     
                      <input aria-label="Title" type="text" className="contenteditable" name="title" value={todo.title} />
                    </form>
                  </td>
                  {props.properties.map((property) => {
                    const value = 
                      ((typeof todo[property.id] === 'boolean' && property.name !== 'completed') ? (todo[property.id] ? 'Yes' : 'No') : '') ||
                      (typeof todo[property.id] === 'string' && `${todo[property.id]}`) ||
                      (typeof todo[property.id] === 'number' && property.name !== 'id' && `${todo[property.id]}`) || '';
                    
                    return (
                      <td>
                        <form method="POST" action="/api/todos">
                          <input type="hidden" name="method" value="PUT" />
                          <input type="hidden" name="id" value={todo.id} />
                          <input type="hidden" name="title" value={todo.title} />
                          {props.properties.map((p) => {
                            if (p.id === property.id) {
                              return;
                            }

                            return (
                              <input type="hidden" name={`${p.id}`} value={`${todo[p.id] || ''}`} />
                            );
                          })}
                          <input aria-label={property.name} type="text" name={`${property.id}`} className="contenteditable" value={value} />
                        </form>
                      </td>
                    );
                  })}
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
