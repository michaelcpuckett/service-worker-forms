import React from "react";
import { Row, Property, Database, Referrer } from '../types';
import { UpdateRowCompletedForm } from '../forms/UpdateRowCompletedForm';
import {SearchRowsForm} from '../forms/SearchRowsForm';
import {FilterRows} from './FilterRows';
import {RowActionsMenu} from '../menus/RowActionsMenu';

export function TableView(
  props: React.PropsWithoutRef<{ database: Database; referrer: Referrer; }>
) {
  const rows = props.database.rows;
  const properties = props.database.properties;

  const queriedRows = rows.filter((row) => {
    if (!props.referrer.query) {
      return true;
    }

    const allStringProperties = [
      'title',
      ...properties.filter((property) => property.type === String).map((property) => property.id),
    ]

    return allStringProperties.find((stringProperty) => {
      if (!props.referrer.query) {
        return false;
      }

      return (row[stringProperty] || '').toLowerCase().includes(props.referrer.query.toLowerCase());
    });
  });

  const filteredRows = queriedRows.filter((row) => {
    switch (props.referrer.filter) {
      case 'completed':
        return row.completed;
      case 'incompleted':
        return !row.completed;
      default:
        return true;
    }
  });

  const gridColumnsCss = `auto minmax(0, 1fr) ${properties.length ? `repeat(${properties.length}, minmax(0, 1fr))` : ''} auto`;

  return (
    <section aria-label="Table View">
      {rows.length === 0 ? (
        <p>
          No rows yet. Add one below.
        </p>
      ) : null}
      <nav aria-label="Actions">
        <FilterRows rows={rows} referrer={props.referrer} />
        <SearchRowsForm referrer={props.referrer} />
      </nav>
      <table className="table-view" style={{
        '--grid-columns': gridColumnsCss,
      }}>
        <thead>
          <tr>
            <th>
              Done
            </th>
            <th>
              Title
            </th>
            {properties.map((property) => (
              <th>
                {property.name}
              </th>
            ))}
            <th>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index, { length }) => {
            const filteredIndex = filteredRows.findIndex((t) => t.id === row.id);

            if (filteredIndex === -1) {
              return null;
            }

            return (
              <tr
                aria-label={row.title}
                data-completed={row.completed ? '' : undefined}>
                <td>
                  <UpdateRowCompletedForm
                    row={row}
                    properties={properties}
                    autofocus={(['EDIT_ROW_COMPLETED'].includes(props.referrer.state) && index === (props.referrer.index ?? (length - 1)))}
                  />
                </td>
                <td>
                  <input
                    form={`edit-row-inline-form--${row.id}`}
                    id={`edit-row-inline-form-field--${row.id}--title`}
                    autoComplete="off"
                    aria-label="Title"
                    type="text"
                    className="contenteditable title"
                    name="title"
                    value={row.title}
                  />
                  <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="-2.5 0 19 19">
                    <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                  </svg>
                </td>
                {properties.map((property) => {
                  const value = 
                    ((typeof row[property.id] === 'boolean' && property.name !== 'completed') ? (row[property.id] ? 'Yes' : 'No') : '') ||
                    (typeof row[property.id] === 'string' && `${row[property.id]}`) ||
                    (typeof row[property.id] === 'number' && property.name !== 'id' && `${row[property.id]}`) || '';
                  
                  return (
                    <td>
                      <input
                        id={`edit-row-inline-form-field--${row.id}--${property.id}`}
                        autoComplete="off"
                        aria-label={property.name}
                        form={`edit-row-inline-form--${row.id}`}
                        type="text" name={`${property.id}`}
                        className="contenteditable"
                        value={value}
                      />
                      <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="-2.5 0 19 19">
                        <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                      </svg>
                    </td>
                  );
                })}
                <td aria-label={`Actions for ${row.title}`}>
                  <form method="POST" action={`/api/databases/${props.database.id}/rows/${row.id}`} id={`edit-row-inline-form--${row.id}`} role="none">
                    <input type="hidden" name="method" value="PUT" />
                    <button type="submit" hidden>
                      Update
                    </button>
                  </form>
                  <RowActionsMenu
                    row={row}
                    rows={rows}
                    index={index}
                    filteredIndex={filteredIndex}
                    filteredRows={filteredRows}
                    referrer={props.referrer}
                  />
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <input
                name="completed"
                type="checkbox"
                aria-label="Completed"
                form="add-row-form"
              />
            </td>
            <td>
              <input
                aria-label="Title"
                autoComplete="off"
                type="text"
                name="title"
                form="add-row-form"
                placeholder="Title"
                className="contenteditable"
                data-auto-focus={props.referrer.state === 'ADD_ROW'}
                value=""
              />
              <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="-2.5 0 19 19">
                <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
              </svg>
            </td>
            {properties.map((property) => {
              return (
                <td>
                  <input
                    aria-label={property.name}
                    autoComplete="off"
                    className="contenteditable"
                    form="add-row-form"
                    key={property.id}
                    type="text"
                    name={`${property.id}`}
                    placeholder={property.name}
                    value=""
                  />
                  <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="-2.5 0 19 19">
                    <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                  </svg>
                </td>
              );
            })}
            <td>
              <form action={`/api/databases/${props.database.id}/rows`} method="POST" role="none" id="add-row-form" data-auto-save="false">
                <input type="hidden" name="method" value="POST" />
                <button type="submit" className="button">
                  Add
                </button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
