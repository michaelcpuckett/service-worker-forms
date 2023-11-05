import React from "react";
import { Todo, Referrer } from '../types';
import { UpdateTodoCompletedForm } from './UpdateTodoCompletedForm';
import { UpdateTodoTitleInlineForm } from './UpdateTodoTitleInlineForm';
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
      </>}
    </section>
  );
}
