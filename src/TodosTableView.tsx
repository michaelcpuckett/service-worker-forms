import { Todo, ReferrerState } from './types';

export function TodosTableView(
  props: React.PropsWithoutRef<{ todos: Todo[], referrerState: ReferrerState }>
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
                <form action="" method="POST">
                  <input type="hidden" name="action" value="/api/todos" />
                  <input type="hidden" name="method" value="DELETE" />
                  <input type="hidden" name="id" value={todo.id} />
                  <button type="submit" autoFocus={(props.referrerState === 'DELETE_TODO' && index === length - 1) ? true : undefined}>
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
