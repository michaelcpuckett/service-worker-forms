import { Referrer, Settings, Todo } from './types';
import {TodosTableView} from './TodosTableView';
import { PageShell } from './PageShell';

export function TodosPage(props: React.PropsWithChildren<{ todos?: Todo[]; referrer: Referrer; settings: Settings; }>) {
  return (
    <PageShell pageTitle="Settings" settings={props.settings}>
      <div className="container">
        <nav>
          <a href="/settings">Settings</a>
        </nav>
      </div>
      <div className="container">
        <main>
          <h1>Todos</h1>
          <form action="/api/todos" method="POST">
            <input type="hidden" name="method" value="POST" />
            <label>
              Title
              <input autoFocus={((props.referrer.state === 'DELETE_TODO' && props.todos?.length === 0) || (props.referrer.state === 'ADD_TODO')) ? true : undefined} type="text" name="title" placeholder="Title" />
            </label>
            <button type="submit">Add</button>
          </form>
          <TodosTableView todos={props.todos || []} referrer={props.referrer} />
        </main>
      </div>
    </PageShell>
  );
}