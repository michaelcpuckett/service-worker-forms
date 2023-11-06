import { renderToString } from "react-dom/server";
import { TodosPage } from "./pages/TodosPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Todo, Referrer, Settings } from "./types";
import { openDB, DBSchema, IDBPDatabase, wrap } from 'idb';

const URLS_TO_CACHE = [
  '/style.css',
  '/interactivity.js',
  '/manifest.json',
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
      const url = new URL(event.request.url);
      const pathname = url.pathname;
      const state = url.searchParams.get('state') || '';
      const index = Number(url.searchParams.get('index') ?? 0);
      const filter = url.searchParams.get('filter') || '';
      const query = url.searchParams.get('query') || '';
      const referrer = {
        state,
        index,
        filter,
        query,
        url: event.request.url,
      };

      if (URLS_TO_CACHE.includes(pathname)) {
        const cache = await caches.open('v1');
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      switch (pathname) {
        case '/': {
          const db = await getDb();
          const renderResult = await renderTodosPage(db, referrer);
          
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
    const {pathname} = new URL(event.request.url);

    switch (pathname) {
      case '/api/search': {
        switch (formData.method) {
          case 'POST': {
            const url = new URL(event.request.referrer);
            url.searchParams.set('state', 'SEARCH_TODOS');
            url.searchParams.set('query', formData.query ?? '');

            return new Response(null, {
              headers: {
                "Location": url.href,
              },
              status: 303,
            });
          }
        }
      }
      case '/api/todos/ui': {
        const url = new URL(event.request.referrer);

        for (const [key, value] of Object.entries(formData)) {
          url.searchParams.set(key, value);
        }

        return new Response(null, {
          headers: {
            "Location": url.href,
          },
          status: 303,
        });
      }
      case '/api/todos': {
        switch (formData.method) {
          case 'POST': {
            const db = await getDb();
            const id = Date.now();
            const todo: Todo = {
              id,
              title: formData.title || 'No title',
              completed: false,
            };

            await saveTodoToIndexedDB(todo, db);

            const url = new URL(event.request.referrer);
            url.searchParams.set('state', 'ADD_TODO');

            return new Response(null, {
              headers: {
                "Location": url.href,
              },
              status: 303,
            });
          }

          case 'PUT': {
            const db = await getDb();
            const id = Number(formData.id);
            const todos = await getTodosFromIndexedDb(db);
            const index = todos.findIndex(todo => todo.id === id);

            if ('index' in formData) {
              const newIndex = Number(formData.index);
              const prev = {...todos[newIndex], id: todos[index].id};
              const todo = {...todos[index], id: todos[newIndex].id};

              await editTodoInIndexedDb(todo, todo.id, db);
              await editTodoInIndexedDb(prev, prev.id, db);

              const url = new URL(event.request.referrer);
              url.searchParams.set('state', `REORDER_TODO_${newIndex < index ? 'UP' : 'DOWN'}`);
              url.searchParams.set('index', `${newIndex}`);

              return new Response(null, {
                headers: {
                  "Location": url.href,
                },
                status: 303,
              });
            }
            const prev = todos[index];
            const todo: Todo = {
              id,
              title: formData.title || 'No title',
              completed: formData.completed === 'on',
            };

            await editTodoInIndexedDb(todo, id, db);

            const url = new URL(event.request.referrer);
            url.searchParams.set('state', prev.completed !== todo.completed ? 'EDIT_TODO_COMPLETED' : 'EDIT_TODO');
            url.searchParams.set('index', `${index}`);

            return new Response(null, {
              headers: {
                "Location": url.href,
              },
              status: 303,
            });
          }

          case 'DELETE': {
            const db = await getDb();
            const id = Number(formData.id);
            const todos = await getTodosFromIndexedDb(db);
            const index = todos.findIndex(todo => todo.id === id);

            await deleteTodoInIndexedDb(id, db);

            const url = new URL(event.request.referrer);
            url.searchParams.set('state', 'DELETE_TODO');
            url.searchParams.set('index', `${index}`);

            return new Response(null, {
              headers: {
                "Location": url.href,
              },
              status: 303,
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

            const url = new URL(event.request.referrer);
            url.searchParams.set('state', 'CHANGE_THEME');

            return new Response(null, {
              headers: {
                "Location": url.href,
              },
              status: 303,
            });
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