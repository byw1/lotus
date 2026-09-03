/**
 * Shared form state.
 *
 * This lives outside `src/app/actions.ts` because a `"use server"` module may
 * only export async functions — every other export is a build error. Types and
 * constants have to sit somewhere else.
 */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Keyed by field name; rendered next to the offending input. */
  errors?: Record<string, string>;
  /** Echoed back so a failed submission does not wipe what someone typed. */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };
