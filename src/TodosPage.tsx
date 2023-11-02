import { ReferrerState, Todo } from './types';
import {TodosTableView} from './TodosTableView';

export function TodosPage(props: React.PropsWithChildren<{ todos?: Todo[]; referrerState: ReferrerState; }>) {
  return (
    <html>
      <head>
        <title>Todos</title>
        <script src="/scroll-restoration.js"></script>
      </head>
      <body>
        <h1>Todos</h1>
        <form action="" method="POST">
          <input type="hidden" name="action" value="/api/todos" />
          <input type="hidden" name="method" value="POST" />
          <label>
            Title
            <input autoFocus={props.referrerState === 'ADD_TODO' ? true : undefined} type="text" name="title" placeholder="Title" />
          </label>
          <button type="submit">Add</button>
        </form>
        <TodosTableView todos={props.todos || []} referrerState={props.referrerState} />
      </body>
    </html>
  );
}