import React from "react";
import { Referrer, Settings, Todo } from '../types';
import {TodosTableView} from '../components/TodosTableView';
import {NewTodoForm} from '../components/NewTodoForm';
import { PageShell } from './PageShell';
import { EditTodoForm } from '../components/EditTodoForm';
import { ModalDialog } from '../components/ModalDialog';
import { ConfirmDeleteTodoForm } from '../components/ConfirmDeleteTodoForm';

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
        <ModalDialog open>
          <EditTodoForm
            index={props.referrer.index || 0}
            todo={(props.todos || [])[Number(props.referrer.index)]}
            autofocus={true}
          />
        </ModalDialog>
      ) : null}
      {props.referrer.state === 'CONFIRMING_DELETE_TODO' ? (
        <ModalDialog open>
          <ConfirmDeleteTodoForm
            todo={(props.todos || [])[Number(props.referrer.index)]}
            autofocus={true}
            referrer={props.referrer}
          />
        </ModalDialog>
      ) : null}
    </PageShell>
  );
}