import { renderToString } from "react-dom/server";
import { TodosPage } from "./pages/TodosPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Todo, Referrer, Settings, Property } from "./types";
import { IDBPDatabase, wrap } from 'idb';
import { pathToRegexp, match, parse, compile }from "path-to-regexp";

const URLS_TO_CACHE = [
  '/style.css',
  '/icons.svg',
  '/interactivity.js',
  '/manifest.json',
];

function getTypeFromString(type: string) {
  switch (type) {
    case 'Number':
      return Number;
    case 'Boolean':
      return Boolean;
    case 'String':
    default:
      return String;
  }
}

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

  const url = new URL(event.request.url);

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

    const matchesTodo = pathToRegexp("/api/todos/:id").exec(pathname);
    const matchesTodoCompleted = pathToRegexp("/api/todos/:id/completed").exec(pathname);

    if (matchesTodo) {
      switch (formData.method) {
        case 'PUT': {
          const db = await getDb();
          const id = Number(matchesTodo[1]);
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

          const prev = todos[index] || {};

          const todo = {
            id,
            title: ('title' in formData ? formData.title : prev.title) || '',
            completed: prev.completed,
          };

          const properties = await getPropertiesFromIndexedDb(db);

          for (const property of properties) {
            const value = formData[property.id] || prev[property.id];

            if (property.type === String) {
              todo[property.id] = value || '';
            }

            if (property.type === Number) {
              todo[property.id] = Number(value) || 0;
            }

            if (property.type === Boolean) {
              todo[property.id] = Boolean(value);
            }
          }

          await editTodoInIndexedDb(todo as Todo, id, db);

          const url = new URL(event.request.referrer);
          url.searchParams.set('state', 'EDIT_TODO');
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
          const id = Number(matchesTodo[1]);
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

    if (matchesTodoCompleted) {
      switch (formData.method) {
        case 'PUT': {
          const db = await getDb();
          const id = Number(matchesTodoCompleted[1]);
          const todos = await getTodosFromIndexedDb(db);
          const index = todos.findIndex(todo => todo.id === id);
          const prev = todos[index] || {};
          const todo = {...prev, completed: formData.completed === 'on'};
          
          await editTodoInIndexedDb(todo, todo.id, db);
          
          const url = new URL(event.request.referrer);
          url.searchParams.set('state', 'EDIT_TODO_COMPLETED');
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

    switch (pathname) {
      case '/api/properties': {
        switch (formData.method) {
          case 'POST': {
            const db = await getDb();

            await addPropertyToIndexedDB({
              id: Date.now(),
              type: formData.type,
              name: formData.name,
              index: Number(formData.index),
            }, db);

            return new Response(null, {
              headers: {
                "Location": event.request.referrer,
              },
              status: 303,
            });
          }
          case 'PUT': {
            const db = await getDb();

            await editPropertyInIndexedDB({
              id: Number(formData.id),
              type: formData.type,
              name: formData.name,
              index: Number(formData.index),
            }, db);

            return new Response(null, {
              headers: {
                "Location": event.request.referrer,
              },
              status: 303,
            });
          }
        }
      }
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
            const todo = {
              id,
              title: formData.title || '',
              completed: formData.completed === 'on',
            };

            const properties = await getPropertiesFromIndexedDb(db);

            for (const property of properties) {
              const value = formData[property.id];

              if (property.type === String) {
                todo[property.id] = value || '';
              }

              if (property.type === Number) {
                todo[property.id] = Number(value) || 0;
              }

              if (property.type === Boolean) {
                todo[property.id] = Boolean(value);
              }
            }
            
            await saveTodoToIndexedDB(todo as Todo, db);

            const url = new URL(event.request.referrer);
            url.searchParams.set('state', 'ADD_TODO');

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
  const properties = await getPropertiesFromIndexedDb(db);

  return renderToString(TodosPage({todos, referrer, settings, properties}));
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

async function getPropertiesFromIndexedDb(db: IDBPDatabase<unknown>): Promise<Property[]> {
  const tx = db.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  const properties = await store.getAll();

  if (properties.length) {
    for (const property of properties) {
      property.type = getTypeFromString(property.type);
    }

    return properties;
  }

  return [];
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

type PropertyWithStringType = {
  id: Property['id']
  type: 'String' | 'Number' | 'Boolean',
  name: Property['name'],
  index: Property['index'],
};

async function addPropertyToIndexedDB(property: PropertyWithStringType, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  await store.add(property, property.id);
  await tx.done;
}

async function editPropertyInIndexedDB(property: PropertyWithStringType, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  await store.put(property, property.id);
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
      openRequest.result.createObjectStore('properties');
    });

    openRequest.addEventListener('error', (event) => {
      console.error(event);
    });
  });
}