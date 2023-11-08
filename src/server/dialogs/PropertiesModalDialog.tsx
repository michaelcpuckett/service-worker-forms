import React from 'react';
import { Property } from '../types';
import { ModalDialog } from './ModalDialog';
import { AddPropertyForm } from '../forms/AddPropertyForm';
import { EditPropertyForm } from '../forms/EditPropertyForm';

export function PropertiesModalDialog(props: React.PropsWithChildren<{ closeButtonData?: Record<string, string|number>; properties?: Property[]; }>) {
  const properties: Property[] = props.properties || [];

  return (
    <ModalDialog heading={<>Edit Properties</>} open closeButtonData={props.closeButtonData || {
      state: 'CLOSE_EDIT_PROPERTIES_DIALOG',
    }}>
      <AddPropertyForm />
      {properties.map((property) => <>
        <hr role="none" />
        <EditPropertyForm property={property} />
      </>)}
    </ModalDialog>
  );
}
