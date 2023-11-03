import { Referrer, Todo } from './types';
import {TodosTableView} from './TodosTableView';

export function TodosPage(props: React.PropsWithChildren<{ todos?: Todo[]; referrer: Referrer; }>) {
  return (
    <html>
      <head>
        <title>Todos</title>
        <script src="/scroll-restoration.js"></script>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <h1>Todos</h1>
          <form action="" method="POST">
            <input type="hidden" name="action" value="/api/todos" />
            <input type="hidden" name="method" value="POST" />
            <label>
              Title
              <input autoFocus={((props.referrer.state === 'DELETE_TODO' && props.todos?.length === 0) || (props.referrer.state === 'ADD_TODO')) ? true : undefined} type="text" name="title" placeholder="Title" />
            </label>
            <button type="submit">Add</button>
          </form>
          <TodosTableView todos={props.todos || []} referrer={props.referrer} />
        </main>
      </body>
    </html>
  );
}