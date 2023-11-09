import React from 'react';
import { Database, Property } from '../types';
import { ModalDialog } from './ModalDialog';
import { AddPropertyForm } from '../forms/AddPropertyForm';
import { EditPropertyForm } from '../forms/EditPropertyForm';

export function PropertiesModalDialog(props: React.PropsWithChildren<{ closeButtonData?: Record<string, string|number>; database: Database; }>) {
  const properties = props.database.properties || [];

  return (
    <ModalDialog heading={<>Edit Properties</>} open closeButtonData={props.closeButtonData || {
      state: 'CLOSE_EDIT_PROPERTIES_DIALOG',
    }}>
      <AddPropertyForm database={props.database} />
      {properties.map((property) => <>
        <hr role="none" />
        <EditPropertyForm property={property} />
      </>)}
    </ModalDialog>
  );
}
