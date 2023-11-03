import { Todo, Referrer } from './types';

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
                  <form action="/api/todos" method="POST" data-auto-submit>
                    <input type="hidden" name="method" value="PUT" />
                    <input type="hidden" name="id" value={todo.id} />
                    <input type="hidden" name="title" value={todo.title} />
                    <input
                      autoFocus={(props.referrer.state === 'EDIT_TODO_COMPLETED' && index === (props.referrer.index ?? (length - 1))) ? true : undefined}
                      name="completed"
                      type="checkbox"
                      checked={todo.completed}
                    />
                    <noscript>
                      <br />
                      <button type="submit">
                        Update
                      </button>
                    </noscript>
                  </form>
                </td>
                <td>
                  {(props.referrer.state === 'EDITING_TODO' && index === (props.referrer.index ?? (length - 1))) ? (
                    <form action="/api/todos" method="POST" className="inline-form">
                      <input type="hidden" name="method" value="PUT" />
                      <input type="hidden" name="id" value={todo.id} />
                      <input type="hidden" name="completed" value={todo.completed ? 'on' : 'off'} />
                      <label>
                        <input
                          autoComplete="off"
                          autoFocus
                          required
                          type="text"
                          name="title"
                          placeholder="Title"
                          value={todo.title}
                          aria-label="Title"
                        />
                      </label>
                      <button type="submit">
                        Save
                      </button>
                      <a href={`?state=EDIT_TODO_TITLE&index=${props.referrer.index}`} role="button">
                        Cancel
                      </a>
                    </form>
                  ) : (
                    <span className="title">
                      {todo.title}
                    </span>
                  )}
                </td>
                <td>
                  <a
                    href={`?state=EDITING_TODO&index=${index}`}
                    role="button"
                    autoFocus={(props.referrer.state === 'EDIT_TODO_TITLE' && index === (props.referrer.index ?? (length - 1))) ? true : undefined}>
                    Edit
                  </a>
                </td>
                <td>
                  <form action="/api/todos" method="POST">
                    <input type="hidden" name="method" value="DELETE" />
                    <input type="hidden" name="id" value={todo.id} />
                    <button type="submit" autoFocus={(props.referrer.state === 'DELETE_TODO' && index === Math.min(length - 1, Math.max(0, (props.referrer.index ?? length)))) ? true : undefined}>
                      Delete
                    </button>
                  </form>
                </td>
                
                <td>
                  <form action="/api/todos" method="POST">
                    <input type="hidden" name="method" value="PUT" />
                    <input type="hidden" name="id" value={todo.id} />
                    <input type="hidden" name="title" value={todo.title} />
                    <input type="hidden" name="completed" value={todo.completed ? 'on' : 'off'} />
                    <input type="hidden" name="index" value={index - 1} />
                    <button aria-label="Move up" disabled={index === 0 ? true : undefined} type="submit" autoFocus={(props.referrer.state === 'REORDER_TODO_UP' && index === props.referrer.index) || (props.referrer.state === 'REORDER_TODO_DOWN' && index === props.referrer.index && index === (props.todos.length - 1))}>
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 14l5-5 5 5z" />
                      </svg>
                    </button>
                  </form>
                </td>
                <td>
                  <form action="/api/todos" method="POST">
                    <input type="hidden" name="method" value="PUT" />
                    <input type="hidden" name="id" value={todo.id} />
                    <input type="hidden" name="title" value={todo.title} />
                    <input type="hidden" name="completed" value={todo.completed ? 'on' : 'off'} />
                    <input type="hidden" name="index" value={index + 1} />
                    <button aria-label="Move down" disabled={index === (props.todos.length - 1)} type="submit" autoFocus={(props.referrer.state === 'REORDER_TODO_DOWN' && index === props.referrer.index) || (props.referrer.state === 'REORDER_TODO_UP' && index === 0 && props.referrer.index === 0)}>
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
