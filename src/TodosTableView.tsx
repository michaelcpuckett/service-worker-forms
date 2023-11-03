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
                    <form action="/api/todos" method="POST">
                      <input type="hidden" name="method" value="PUT" />
                      <input type="hidden" name="id" value={todo.id} />
                      <input type="hidden" name="completed" value={todo.completed ? 'on' : 'off'} />
                      <label>
                        <input autoFocus type="text" name="title" placeholder="Title" value={todo.title} />
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
