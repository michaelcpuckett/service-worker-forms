import React from "react";

export function ModalDialog(props: React.PropsWithChildren<{ open: boolean }>) {
  return (
    <dialog aria-modal={true} open={props.open}>
      <div className="modal-dialog-body" role="none">
        {props.children}
      </div>
    </dialog>
  );
}
