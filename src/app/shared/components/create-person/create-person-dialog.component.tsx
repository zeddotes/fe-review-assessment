import { useRef } from "react";
import "./create-person-dialog.css";

export interface CreatePersonDialogProps {}

export default function CreatePersonDialog({}: CreatePersonDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  return (
    <>
      <button
        className="button-secondary h-fit"
        onClick={() => {
          if (dialogRef?.current) {
            dialogRef.current.showModal();
          }
        }}
      >
        <i className="fa-solid fa-plus mr-1"></i>Create Person
      </button>
      <dialog ref={dialogRef}>
        <h1>Create Person</h1>
        <p>Sorry, but there's no Create Person functionality here.</p>
        <p>
          In reality, I just wanted to use the <code>HTML</code>{" "}
          <code>dialog</code> element in React, and here it is.
        </p>
        <button
          onClick={() => {
            dialogRef.current?.close();
          }}
          className="button-secondary"
        >
          Close
        </button>
      </dialog>
    </>
  );
}
