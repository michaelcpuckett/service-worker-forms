import { renderToString } from "react-dom/server";
import { TodosPage } from "./TodosPage";
import { SettingsPage } from "./SettingsPage";
import { Todo, Referrer, Settings } from "./types";
import { openDB, DBSchema, IDBPDatabase, wrap } from 'idb';

const URLS_TO_CACHE = [
  '/index.html',
  '/style.css',
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
        case '/':
        case '/app': {
          const db = await getDb();
          const renderResult = await renderTodosPage(db, {
            state: 'GET_TODOS'
          });
          
          return new Response(`<!DOCTYPE html>${renderResult}`, {
            headers: { "Content-Type": "text/html" },
          });
        }
        case '/settings': {
          const db = await getDb();
          const renderResult = await renderSettingsPage(db);

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

            if (['/app', '/'].includes(new URL(event.request.referrer).pathname)) {
              const renderResult = await renderTodosPage(db, {
                state: 'ADD_TODO'
              });

              return new Response(`<!DOCTYPE html>${renderResult}`, {
                headers: { "Content-Type": "text/html" },
              });
            }
          }

          case 'PUT': {
            const db = await getDb();
            const id = Number(formData.id);
            const todos = await getTodosFromIndexedDb(db);
            const index = todos.findIndex(todo => todo.id === id);
            const todo: Todo = {
              id,
              title: formData.title || 'No title',
            };

            await editTodoInIndexedDb(todo, id, db);

            const renderResult = await renderTodosPage(db, {
              state: 'EDIT_TODO',
              index,
            });

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }

          case 'DELETE': {
            const db = await getDb();
            const id = Number(formData.id);
            const todos = await getTodosFromIndexedDb(db);
            const index = todos.findIndex(todo => todo.id === id);

            await deleteTodoInIndexedDb(id, db);

            const renderResult = await renderTodosPage(db, {
              state: 'DELETE_TODO',
              index,
            });

            return new Response(`<!DOCTYPE html>${renderResult}`, {
              headers: { "Content-Type": "text/html" },
            });
          }
        }
      }
      break;
      case '/api/settings': {
        switch (formData.method) {
          case 'PUT': {
            const db = await getDb();
            const theme = formData.theme;
            
            await saveSettingsToIndexedDb({ theme }, db);

            if (new URL(event.request.referrer).pathname === '/settings') {
              const renderResult = await renderSettingsPage(db);

              return new Response(`<!DOCTYPE html>${renderResult}`, {
                headers: { "Content-Type": "text/html" },
              });
            }
          }
        }
      }
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

async function renderTodosPage(db: IDBPDatabase<unknown>, referrer: Referrer) {
  const todos = await getTodosFromIndexedDb(db);
  const settings = await getSettingsFromIndexedDb(db);
  return renderToString(TodosPage({todos, referrer, settings}));
}

async function renderSettingsPage(db: IDBPDatabase<unknown>) {
  const settings = await getSettingsFromIndexedDb(db);
  return renderToString(SettingsPage({settings}));
}

async function getSettingsFromIndexedDb(db: IDBPDatabase<unknown>) {
  const tx = db.transaction('settings', 'readwrite');
  const store = tx.objectStore('settings');
  const theme = await store.get('theme');
  return { theme };
}

async function saveSettingsToIndexedDb(settings: Settings, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('settings', 'readwrite');
  const store = tx.objectStore('settings');
  await store.put(settings.theme, 'theme');
  await tx.done;
}

async function getTodosFromIndexedDb(db: IDBPDatabase<unknown>) {
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

async function editTodoInIndexedDb(todo: Todo, id: number, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('todos', 'readwrite');
  const store = tx.objectStore('todos');
  await store.put(todo, id);
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
      openRequest.result.createObjectStore('settings');
    });

    openRequest.addEventListener('error', (event) => {
      console.error(event);
    });
  });
}