import { Referrer, Todo } from "./types";

export function NewTodoForm(props: React.PropsWithChildren<{ referrer: Referrer; todos: Todo[]; }>) {
  return (
    <section aria-label="New Todo">
      <h2>New Todo</h2>
      <form action="/api/todos" method="POST" className="inline-form">
        <input type="hidden" name="method" value="POST" />
        <label>
          <input required aria-label="Title" autoComplete="off" autoFocus={((props.referrer.state === 'DELETE_TODO' && props.todos?.length === 0) || (props.referrer.state === 'ADD_TODO')) ? true : undefined} type="text" name="title" placeholder="Title" />
        </label>
        <button type="submit">Add</button>
      </form>
    </section>
  );
}