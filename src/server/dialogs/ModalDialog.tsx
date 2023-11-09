import React from "react";

export function ModalDialog(props: React.PropsWithChildren<{ heading: React.ReactElement; open: boolean; closeButtonData?: Record<string, string|number>; }>) {
  return (
    <dialog aria-labelledby="modal-dialog-header" aria-modal={true} open={props.open}>
      <div className="modal-dialog-body" role="none">
        <form action="/api/rows/ui" method="POST" className="close-dialog-form" role="none">
          {props.closeButtonData ? 
            Object.entries(props.closeButtonData).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)
            : <>
              <input type="hidden" name="state" value="" />
            </>
          }
          <button className="button" type="submit" aria-label="Close dialog">X</button>
        </form>
        <h1 id="modal-dialog-header">{props.heading}</h1>
        <div className="modal-dialog-content" role="none">
          {props.children}
        </div>
      </div>
    </dialog>
  );
}
