import React from 'react';
import { PageShell } from './PageShell';
import { Database, Referrer, Settings } from '../types';
import { AddDatabaseForm } from '../forms/AddDatabaseForm';

export function HomePage(props: React.PropsWithChildren<{ databases: Database[], settings: Settings, referrer: Referrer}>) {
  return (
    <PageShell pageTitle="Home" settings={props.settings}>
      <div className="container">
        <nav>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <h1>
            Home
          </h1>
          <ul>
            {props.databases.map((database) => (
              <li key={database.id}>
                <a href={`/databases/${database.id}`}>
                  {database.name}
                </a>
              </li>
            ))}
          </ul>
          <AddDatabaseForm />
        </main>
      </div>
    </PageShell>
  );
}