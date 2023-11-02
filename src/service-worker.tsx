import { renderToString } from "react-dom/server";
import { TodosPage } from "./TodosPage";
import { Todo } from "./ITodo";
import { openDB, DBSchema, IDBPDatabase, wrap } from 'idb';

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