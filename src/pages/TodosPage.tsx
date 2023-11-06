import React from "react";
import { Referrer, Settings, Todo } from '../types';
import {TodosTableView} from '../components/TodosTableView';
import {NewTodoForm} from '../components/NewTodoForm';
import { PageShell } from './PageShell';
import { EditTodoModalDialog } from '../dialogs/EditTodoModalDialog';
import { ConfirmDeleteModalDialog } from '../dialogs/ConfirmDeleteModalDialog';

export function TodosPage(props: React.PropsWithChildren<{ todos?: Todo[]; referrer: Referrer; settings: Settings; }>) {
  return (
    <PageShell pageTitle="Todos" settings={props.settings}>
      <div className="container" inert={['CONFIRMING_DELETE_TODO', 'EDITING_TODO'].includes(props.referrer.state) ? '' : null}>
        <nav>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <h1>Todos</h1>
          <NewTodoForm todos={props.todos || []} referrer={props.referrer} />
          <TodosTableView todos={props.todos || []} referrer={props.referrer} />
        </main>
      </div>
      {props.referrer.state === 'EDITING_TODO' ? (
        <EditTodoModalDialog
          index={props.referrer.index || 0}
          todo={(props.todos || [])[Number(props.referrer.index)]}
        />
      ) : null}
      {props.referrer.state === 'CONFIRMING_DELETE_TODO' ? (
        <ConfirmDeleteModalDialog
          referrer={props.referrer}
          todos={props.todos || []}
          index={props.referrer.index || 0}
          todo={(props.todos || [])[Number(props.referrer.index)]}
        />
      ) : null}
    </PageShell>
  );
}