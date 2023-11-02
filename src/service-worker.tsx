import { renderToString } from "react-dom/server";
import { openDB, DBSchema, IDBPDatabase, wrap } from 'idb';

interface Todo {
  id: number;
  title: string;
}

function TodosPage(props: React.PropsWithChildren<{ todos?: Todo[] }>) {
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
            <input type="text" name="title" placeholder="Title" />
          </label>
          <button type="submit">Add</button>
        </form>
        <TodosTableView todos={props.todos || []} />
      </body>
    </html>
  );
}

function TodosTableView(props: React.PropsWithoutRef<{ todos: Todo[] }>) {
  return (
    <section>
      <h2>Table View</h2>
      <table>
        <tbody>
          {props.todos.map((todo) => (
            <tr>
              <td>
                {todo.title}
              </td>
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

self.addEventListener("fetch", function (event: Event) {
  if (!(event instanceof FetchEvent)) {
    return;
  }

  if (event.request.url.endsWith('/app')) {
    if (event.request.method === 'GET') {
      return event.respondWith((async () => {
        const db = await getDb();
        const todos = await getTodosFromIndexedDb(db);
        const renderResult = renderToString(TodosPage({todos}));
        
        return new Response(`<!DOCTYPE html>${renderResult}`, {
          headers: { "Content-Type": "text/html" },
        });
      })());
    }
    
    return event.respondWith((async () => {
      const rawFormData = await event.request.formData();
      const formData = Object.fromEntries(rawFormData.entries());

      if (formData.action === '/api/todos') {
        switch (formData.method) {
          case 'POST': {
            const db = await getDb();
            const id = Date.now();
            const todo: Todo = {
              id,
              title: formData.title || 'No title',
            };

            await saveTodoToIndexedDB(todo, db);

            const todos = await getTodosFromIndexedDb(db);
            const renderResult = renderToString(TodosPage({todos}));

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }

          case 'DELETE': {
            const db = await getDb();
            const id = Number(formData.id);

            await deleteTodoInIndexedDb(id, db);

            const todos = await getTodosFromIndexedDb(db);
            const renderResult = renderToString(TodosPage({todos}));

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }
        }
      }

      return new Response('Not found', {
        status: 404,
      });
    })());
  }
});

async function getTodosFromIndexedDb(db: IDBPDatabase<unknown>) {
  console.log(db);
  const tx = db.transaction('todos', 'readwrite');
  const store = tx.objectStore('todos');
  const todos = await store.getAll();
  return todos;
}

async function saveTodoToIndexedDB(todo: Todo, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('todos', 'readwrite');
  const store = tx.objectStore('todos');
  await store.add(todo, todo.id);
  await tx.done;
}

async function deleteTodoInIndexedDb(id: number, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('todos', 'readwrite');
  const store = tx.objectStore('todos');
  await store.delete(id);
  await tx.done;
}

async function getDb(): Promise<IDBPDatabase<unknown>> {
  return await new Promise((resolve) => {
    const openRequest = self.indexedDB.open('todos', 2);
    openRequest.addEventListener('success', () => {
      resolve(wrap(openRequest.result));
    });
    openRequest.addEventListener('upgradeneeded', () => {
      openRequest.result.createObjectStore('todos');
    });
    openRequest.addEventListener('error', (event) => {
      console.error(event);
    });
  });
}