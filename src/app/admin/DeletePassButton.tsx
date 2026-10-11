"use client";

import { useFormStatus } from "react-dom";
import { removePass } from "./actions";

// Delete button for one row of the All Passes table. Asks first, because a deleted pass is gone
// for good and its QR code stops working at the door.
export function DeletePassButton({ code, name, passes }: { code: string; name: string; passes: number }) {
  return (
    <form
      action={removePass}
      onSubmit={(e) => {
        if (!confirm(`Delete pass ${code} for ${name} (admits ${passes})?\n\nThe pass link and QR code will stop working. This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="code" value={code} />
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-saffron/50 px-3 py-1 text-xs text-saffron transition hover:bg-saffron hover:text-ink disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
