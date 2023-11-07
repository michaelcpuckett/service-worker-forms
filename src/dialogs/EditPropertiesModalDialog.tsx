import React from 'react';
import { Property } from '../types';
import { ModalDialog } from './ModalDialog';
import { AddPropertyForm } from '../forms/AddPropertyForm';

export function EditPropertiesModalDialog(props: React.PropsWithChildren<{ closeButtonData?: Record<string, string|number>; properties?: Property[]; }>) {
  const properties: Property[] = props.properties || [];

  return (
    <ModalDialog heading={<>Edit Properties</>} open closeButtonData={props.closeButtonData || {
      state: 'CLOSE_EDIT_PROPERTIES_DIALOG',
    }}>
      <AddPropertyForm />
      {properties.map((property) => (
        <form action="/api/properties" method="POST">
          <input type="hidden" name="method" value="PUT" />
          <input type="hidden" name="id" value={property.id} />
          <input type="hidden" name="index" value={property.index} />
          <label key="type">
            <span>Type</span>
            <select name="type" defaultValue={property.type.constructor.name}>
              <option value="String">String</option>
              <option value="Number">Number</option>
              <option value="Boolean">Boolean</option>
            </select>
          </label>
          <label key="name">
            <span>Name</span>
            <input
              autoComplete="off"
              required
              type="text"
              name="name"
              placeholder="Name"
              value={property.name}
            />
          </label>
        </form>
      ))}
    </ModalDialog>
  );
}
