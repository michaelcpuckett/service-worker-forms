import { Todo, Referrer } from './types';

export function TodosTableView(
  props: React.PropsWithoutRef<{ todos: Todo[], referrer: Referrer }>
) {
  return (
    <section>
      <h2>Table View</h2>
      <table>
        <tbody>
          {props.todos.map((todo, index, { length }) => (
            <tr>
              <td>{todo.title}</td>
              <td>
                <details>
                  <summary autoFocus={(props.referrer.state === 'EDIT_TODO' && index === (props.referrer.index ?? (length - 1))) ? true : undefined}>Edit</summary>
                  <form action="" method="POST">
                    <input type="hidden" name="action" value="/api/todos" />
                    <input type="hidden" name="method" value="PUT" />
                    <input type="hidden" name="id" value={todo.id} />
                    <label>
                      Title
                      <input type="text" name="title" placeholder="Title" value={todo.title} />
                    </label>
                    <button type="submit">
                      Save
                    </button>
                  </form>
                </details>
              </td>
              <td>
                <form action="" method="POST">
                  <input type="hidden" name="action" value="/api/todos" />
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
    </section>
  );
}
