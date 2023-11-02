import { renderToString } from "react-dom/server";
import { TodosPage } from "./TodosPage";
import { Todo, ReferrerState } from "./types";
import { openDB, DBSchema, IDBPDatabase, wrap } from 'idb';

const URLS_TO_CACHE = [
  '/index.html',
  '/scroll-restoration.js',
];

self.addEventListener('install', function (event: Event) {
  if (!(event instanceof ExtendableEvent)) {
    return;
  }

  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll(URLS_TO_CACHE);
    }).catch(function (error) {
      console.error(error);
    })
  );
});

self.addEventListener("fetch", function (event: Event) {
  if (!(event instanceof FetchEvent)) {
    return;
  }

  if (event.request.method === 'GET') {
    return event.respondWith((async () => {
      const pathname = new URL(event.request.url).pathname;

      if (URLS_TO_CACHE.includes(pathname)) {
        const cache = await caches.open('v1');
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      switch (pathname) {
        case '/app': {
          const db = await getDb();
          const renderResult = await renderTodosPage(db, 'GET_TODOS');
          
          return new Response(`<!DOCTYPE html>${renderResult}`, {
            headers: { "Content-Type": "text/html" },
          });
        }
      }

      return new Response('Not found', {
        status: 404,
      });
    })());
  }
  
  return event.respondWith((async () => {
    const rawFormData = await event.request.formData();
    const formData = Object.fromEntries(rawFormData.entries());

    switch (formData.action) {
      case '/api/todos': {
        switch (formData.method) {
          case 'POST': {
            const db = await getDb();
            const id = Date.now();
            const todo: Todo = {
              id,
              title: formData.title || 'No title',
            };

            await saveTodoToIndexedDB(todo, db);

            if (new URL(event.request.referrer).pathname === '/app') {
              const renderResult = await renderTodosPage(db, 'ADD_TODO');

              return new Response(`<!DOCTYPE html>${renderResult}`, {
                headers: { "Content-Type": "text/html" },
              });
            }
          }

          case 'DELETE': {
            const db = await getDb();
            const id = Number(formData.id);

            await deleteTodoInIndexedDb(id, db);

            const renderResult = await renderTodosPage(db, 'DELETE_TODO');

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }
        }
      }
      break;
      default: {
        return new Response('Not found', {
          status: 404,
        });
      }
    }

    return new Response('Not found', {
      status: 404,
    });
  })());
});

async function renderTodosPage(db: IDBPDatabase<unknown>, referrerState: ReferrerState) {
  const todos = await getTodosFromIndexedDb(db);
  return renderToString(TodosPage({todos, referrerState}));
}

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