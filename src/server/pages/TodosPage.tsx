import React from "react";
import { Referrer, Settings, Todo, Property } from '../types';
import {TodosTableView} from '../components/TodosTableView';
import { PageShell } from './PageShell';
import { EditTodoModalDialog } from '../dialogs/EditTodoModalDialog';
import { ConfirmDeleteModalDialog } from '../dialogs/ConfirmDeleteModalDialog';
import {PropertiesModalDialog} from '../dialogs/PropertiesModalDialog';
import {TriggerPropertiesEditForm} from '../forms/TriggerPropertiesEditForm';

export function TodosPage(props: React.PropsWithChildren<{ todos?: Todo[]; referrer: Referrer; settings: Settings; properties: Property[]; }>) {
  return (
    <PageShell pageTitle="Todos" settings={props.settings}>
      <div className="container" inert={['CONFIRMING_DELETE_TODO', 'EDITING_TODO', 'EDITING_PROPERTIES'].includes(props.referrer.state) ? '' : null}>
        <nav>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <header>
            <h1>New Todo List</h1>
            <TriggerPropertiesEditForm autofocus={props.referrer.state === 'CLOSE_EDIT_PROPERTIES_DIALOG'} />
          </header>
          <TodosTableView todos={props.todos || []} referrer={props.referrer} properties={props.properties} />
        </main>
      </div>
      {props.referrer.state === 'EDITING_TODO' ? (
        <EditTodoModalDialog
          index={props.referrer.index || 0}
          todo={(props.todos || [])[Number(props.referrer.index)]}
          properties={props.properties}
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
      {props.referrer.state ==='EDITING_PROPERTIES' ? (
        <PropertiesModalDialog properties={props.properties} />
      ) : null}
    </PageShell>
  );
}