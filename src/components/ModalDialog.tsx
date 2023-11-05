import React from "react";

export function ModalDialog(props: React.PropsWithChildren<{ open: boolean }>) {
  return (
    <dialog aria-modal={true} open={props.open}>
      <div className="body">
        <form action="/api/todos/ui" method="POST" className="close-button-form">
          <input type="hidden" name="state" value="" />
          <button type="submit">
            Close
          </button>
        </form>
        {props.children}
      </div>
    </dialog>
  );
}
