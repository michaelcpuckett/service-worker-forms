import React from "react";
import { Referrer, Settings, Row, Property, Database } from '../types';
import {TableView} from '../components/TableView';
import { PageShell } from './PageShell';
import { EditRowModalDialog } from '../dialogs/EditRowModalDialog';
import { ConfirmDeleteModalDialog } from '../dialogs/ConfirmDeleteModalDialog';
import {PropertiesModalDialog} from '../dialogs/PropertiesModalDialog';
import {TriggerPropertiesEditForm} from '../forms/TriggerPropertiesEditForm';

export function DatabasePage(props: React.PropsWithChildren<{ database: Database; referrer: Referrer; settings: Settings; }>) {
  const rows = props.database.rows;
  const properties = props.database.properties;

  return (
    <PageShell pageTitle="Rows" settings={props.settings}>
      <div className="container" inert={['CONFIRMING_DELETE_ROW', 'EDITING_ROW', 'EDITING_PROPERTIES'].includes(props.referrer.state) ? '' : null}>
        <nav>
          <a href="/">Home</a>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <header>
            <form action={`/api/databases/${props.database.id}`} method="POST" role="none">
              <input type="hidden" name="method" value="PUT" />
              <h1>
                <input id="rows-title-input" required className="contenteditable" name="name" type="text" value={props.database.name} />
              </h1>
              <button type="button" hidden>
                Edit
              </button>
            </form>
            <TriggerPropertiesEditForm autofocus={props.referrer.state === 'CLOSE_EDIT_PROPERTIES_DIALOG'} />
          </header>
          <TableView database={props.database} referrer={props.referrer} />
        </main>
      </div>
      {props.referrer.state === 'EDITING_ROW' ? (
        <EditRowModalDialog
          index={props.referrer.index || 0}
          row={(rows || [])[Number(props.referrer.index)]}
          properties={properties}
        />
      ) : null}
      {props.referrer.state === 'CONFIRMING_DELETE_ROW' ? (
        <ConfirmDeleteModalDialog
          referrer={props.referrer}
          rows={rows || []}
          index={props.referrer.index || 0}
          row={(rows || [])[Number(props.referrer.index)]}
        />
      ) : null}
      {props.referrer.state ==='EDITING_PROPERTIES' ? (
        <PropertiesModalDialog database={props.database} />
      ) : null}
    </PageShell>
  );
}