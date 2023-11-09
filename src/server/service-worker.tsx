// ROW
// If type of property changes, then the value should be reset to the default
// value unless there is a way to convert the value to the new type.

import { renderToString } from "react-dom/server";
import { DatabasePage } from "./pages/DatabasePage";
import { SettingsPage } from "./pages/SettingsPage";
import { Row, Referrer, Settings, Property, Database } from "./types";
import { IDBPDatabase, wrap } from 'idb';
import { pathToRegexp, match, parse, compile }from "path-to-regexp";
import {HomePage} from './pages/HomePage';

const URLS_TO_CACHE = [
  '/style.css',
  '/flyout-menu.css',
  '/icons.svg',
  '/app.js',
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
  
      const matchesDatabase = pathToRegexp("/databases/:id").exec(pathname);

      if (matchesDatabase) {
        const db = await getDb();
        const id = Number(matchesDatabase[1]);
        const renderResult = await renderDatabasePage(id, db, referrer);

        return new Response(`<!DOCTYPE html>${renderResult}`, {
          headers: { "Content-Type": "text/html" },
        });
      }

      const matchesRow = pathToRegexp("/databases/:dbId/rows/:id").exec(pathname);

      if (matchesRow) {
        const url = new URL(event.request.referrer);
        url.pathname = `/databases/${matchesRow[1]}`;
        url.searchParams.set('state', 'EDIT_ROW');

        return new Response(null, {
          headers: {
            "Location": url.href,
          },
          status: 303,
        });
      }

      switch (pathname) {
        case '/': {
          const db = await getDb();
          const renderResult = await renderHomePage(db, referrer);
          
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

    const matchesDatabase = pathToRegexp("/api/databases/:id").exec(pathname);

    if (matchesDatabase) {
      switch (formData.method) {
        case 'PUT': {
          const db = await getDb();
          const id = Number(matchesDatabase[1]);
          const prev = await getDatabaseFromIndexedDb(id, db);
          const name = formData.name || '';
          
          const database = {
            ...prev,
            name,
          };

          await editDatabaseInIndexedDb(database, id, db);

          const url = new URL(event.request.referrer);
          url.searchParams.set('state', 'EDIT_DATABASE');

          return new Response(null, {
            headers: {
              "Location": url.href,
            },
            status: 303,
          });
        }
      }
    }

    const matchesRows = pathToRegexp("/api/databases/:dbid/rows").exec(pathname);

    if (matchesRows) {
      switch (formData.method) {
        case 'POST': {
          const db = await getDb();
          const dbId = Number(matchesRows[1]);
          const properties = await getPropertiesFromIndexedDb(dbId, db);
          const id = Date.now();
          const row = {
            id,
            databaseId: dbId,
            title: formData.title || '',
            completed: false,
          };

          for (const property of properties) {
            row[property.id] = formData[property.id] || '';
          }

          await addRowToIndexedDb(row, db);
          
          const url = new URL(event.request.referrer);
          url.searchParams.set('state', 'ADD_ROW');

          return new Response(null, {
            headers: {
              "Location": url.href,
            },
            status: 303,
          });
        }
      }
    }

    const matchesRow = pathToRegexp("/api/databases/:dbid/rows/:id").exec(pathname);

    if (matchesRow) {
      switch (formData.method) {
        case 'PUT': {
          const db = await getDb();
          const dbId = Number(matchesRow[1]);
          const id = Number(matchesRow[2]);
          const rows = await getRowsFromIndexedDb(dbId, db);
          const index = rows.findIndex(row => row.id === id);

          if ('index' in formData) {
            const newIndex = Number(formData.index);
            const prev = {...rows[newIndex], id: rows[index].id};
            const row = {...rows[index], id: rows[newIndex].id};

            await editRowInIndexedDb(row, row.id, db);
            await editRowInIndexedDb(prev, prev.id, db);

            const url = new URL(event.request.referrer);
            url.searchParams.set('state', `REORDER_ROW_${newIndex < index ? 'UP' : 'DOWN'}`);
            url.searchParams.set('index', `${newIndex}`);

            return new Response(null, {
              headers: {
                "Location": url.href,
              },
              status: 303,
            });
          }

          const prev = rows[index] || {};

          const row = {
            id,
            databaseId: dbId,
            title: ('title' in formData ? formData.title : prev.title) || '',
            completed: prev.completed,
          };

          const properties = await getPropertiesFromIndexedDb(dbId, db);

          for (const property of properties) {
            const value = formData[property.id] || prev[property.id];

            if (property.type === String) {
              row[property.id] = value || '';
            }

            if (property.type === Number) {
              row[property.id] = Number(value) || 0;
            }

            if (property.type === Boolean) {
              row[property.id] = Boolean(value);
            }
          }

          await editRowInIndexedDb(row as Row, id, db);

          const url = new URL(event.request.referrer);
          url.searchParams.set('state', 'EDIT_ROW');
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
          const dbId = Number(matchesRow[1]);
          const id = Number(matchesRow[2]);
          const rows = await getRowsFromIndexedDb(dbId, db);
          const index = rows.findIndex(row => row.id === id);

          await deleteRowInIndexedDb(id, db);

          const url = new URL(event.request.referrer);
          url.searchParams.set('state', 'DELETE_ROW');
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

    const matchesRowCompleted = pathToRegexp("/api/databases/:dbid/rows/:id/completed").exec(pathname);

    if (matchesRowCompleted) {
      switch (formData.method) {
        case 'PUT': {
          const db = await getDb();
          const dbId = Number(matchesRowCompleted[1]);
          const id = Number(matchesRowCompleted[2]);
          const rows = await getRowsFromIndexedDb(dbId, db);
          const index = rows.findIndex(row => row.id === id);
          const prev = rows[index] || {};
          const row = {...prev, completed: formData.completed === 'on'};
          
          await editRowInIndexedDb(row, row.id, db);
          
          const url = new URL(event.request.referrer);
          url.searchParams.set('state', 'EDIT_ROW_COMPLETED');
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

    const matchesProperties = pathToRegexp("/api/databases/:dbId/properties").exec(pathname);
    
    if (matchesProperties) {
      switch (formData.method) {
        case 'POST': {
          const db = await getDb();

          await addPropertyToIndexedDB({
            id: Date.now(),
            databaseId: Number(matchesProperties[1]),
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
            databaseId: Number(matchesProperties[1]),
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

    switch (pathname) {
      case "/api/databases": {
        switch (formData.method) {
          case 'POST': {
            const db = await getDb();
            const id = Date.now();
            const database = {
              id,
              type: formData.type,
              name: formData.name || '',
            };
  
            await addDatabaseToIndexedDb(database, db);
  
            const url = new URL(event.request.referrer);
            url.searchParams.set('state', 'ADD_DATABASE');
  
            return new Response(null, {
              headers: {
                "Location": url.href,
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
            url.searchParams.set('state', 'SEARCH_ROWS');
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
      case '/api/rows/ui': {
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
  })());
});

async function renderHomePage(db: IDBPDatabase<unknown>, referrer: Referrer) {
  const databases = await getDatabasesFromIndexedDb(db);
  const settings = await getSettingsFromIndexedDb(db);

  return renderToString(HomePage({databases, settings, referrer}));
}

async function renderDatabasePage(id: number, db: IDBPDatabase<unknown>, referrer: Referrer) {
  const database = await getDatabaseFromIndexedDb(id, db);
  const settings = await getSettingsFromIndexedDb(db);

  return renderToString(DatabasePage({database, referrer, settings}));
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

async function getPropertiesFromIndexedDb(id: number, db: IDBPDatabase<unknown>): Promise<Property[]> {
  const tx = db.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  const allProperties = await store.getAll();
  const properties = allProperties.filter(property => property.databaseId === id);

  if (properties.length) {
    for (const property of properties) {
      property.type = getTypeFromString(property.type);
    }

    return properties;
  }

  return [];
}

async function addDatabaseToIndexedDb(database: Partial<Database> & {
  id: number;
  name: string;
}, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  await store.add(database, database.id);
  await tx.done;
}

async function saveSettingsToIndexedDb(settings: Settings, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('settings', 'readwrite');
  const store = tx.objectStore('settings');
  await store.put(settings.theme, 'theme');
  await tx.done;
}

async function getDatabaseFromIndexedDb(id: number, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  const database = await store.get(id);
  const rows = await getRowsFromIndexedDb(id, db);
  const properties = await getPropertiesFromIndexedDb(id, db);

  return {
    ...database,
    rows,
    properties,
  };
}

async function getDatabasesFromIndexedDb(db: IDBPDatabase<unknown>) {
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  const databases = await store.getAll();
  return databases;
}

async function getRowsFromIndexedDb(id: number, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('rows', 'readwrite');
  const store = tx.objectStore('rows');
  const rows = await store.getAll();
  return rows.filter(row => row.databaseId === id);
}

async function addRowToIndexedDb(row: Row, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('rows', 'readwrite');
  const store = tx.objectStore('rows');
  await store.add(row, row.id);
  await tx.done;
}

async function editDatabaseInIndexedDb(database: Database, id: number, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  await store.put(database, id);
  await tx.done;
}

async function editRowInIndexedDb(row: Row, id: number, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('rows', 'readwrite');
  const store = tx.objectStore('rows');
  await store.put(row, id);
  await tx.done;
}

async function deleteRowInIndexedDb(id: number, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('rows', 'readwrite');
  const store = tx.objectStore('rows');
  await store.delete(id);
  await tx.done;
}

async function addPropertyToIndexedDB(property: Property, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  await store.add(property, property.id);
  await tx.done;
}

async function editPropertyInIndexedDB(property: Property, db: IDBPDatabase<unknown>) {
  const tx = db.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  await store.put(property, property.id);
  await tx.done;
}

async function getDb(): Promise<IDBPDatabase<unknown>> {
  return await new Promise((resolve) => {
    const openRequest = self.indexedDB.open('clone', 2);

    openRequest.addEventListener('success', () => {
      resolve(wrap(openRequest.result));
    });

    openRequest.addEventListener('upgradeneeded', () => {
      openRequest.result.createObjectStore('databases');
      openRequest.result.createObjectStore('rows');
      openRequest.result.createObjectStore('settings');
      openRequest.result.createObjectStore('properties');
    });

    openRequest.addEventListener('error', (event) => {
      console.error(event);
    });
  });
}

declare module "react" {
  interface HTMLAttributes<T>
    extends React.AriaAttributes,
      React.DOMAttributes<T> {
    shadowrootmode?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "flyout-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}