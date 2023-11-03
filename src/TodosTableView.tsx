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
  return (
    <section>
      <h2>Table View</h2>
      {props.todos.length === 0 ? (
        <p>
        No todos yet. Add one above.
        </p>
      ) : (
        <table className="table-view">
          <tbody>
            {props.todos.map((todo, index, { length }) => (
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
                    <span className="title">
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
                          index={index}
                          isDisabled={index === 0}
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
                          index={index}
                          isDisabled={index === (props.todos.length - 1)}
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
