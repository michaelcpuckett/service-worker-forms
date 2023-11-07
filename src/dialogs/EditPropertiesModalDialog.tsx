import React from 'react';
import { ModalDialog } from './ModalDialog';

export function EditPropertiesModalDialog(props: React.PropsWithChildren<{ closeButtonData?: Record<string, string|number>; }>) {
  return (
    <ModalDialog heading={<>Edit Properties</>} open closeButtonData={props.closeButtonData || {
      state: 'CLOSE_EDIT_PROPERTIES_DIALOG',
    }}>
      <p></p>
    </ModalDialog>
  );
}
