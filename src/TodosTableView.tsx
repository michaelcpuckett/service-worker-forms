import { Todo } from './ITodo';

export function TodosTableView(
  props: React.PropsWithoutRef<{ todos: Todo[] }>
) {
  return (
    <section>
      <h2>Table View</h2>
      <table>
        <tbody>
          {props.todos.map((todo) => (
            <tr>
              <td>{todo.title}</td>
              <td>
                <form action="" method="POST">
                  <input type="hidden" name="action" value="/api/todos" />
                  <input type="hidden" name="method" value="DELETE" />
                  <input type="hidden" name="id" value={todo.id} />
                  <button type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
