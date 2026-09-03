import { leavePreview } from "@/app/team/actions";

/**
 * A standing reminder that this is not the live site.
 *
 * Without it, a sponsor sent a preview link forwards it to somebody who reads
 * a placeholder date as fact. It is deliberately hard to ignore and carries
 * the one control that matters: a way back out.
 */
export function PreviewBar() {
  return (
    <div className="bg-vermilion text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5 sm:px-8">
        <p className="text-[12.5px] leading-snug">
          <strong className="font-semibold">Preview.</strong> Nothing here is final, and dates and
          details are still being confirmed.
        </p>
        <form action={leavePreview}>
          <button
            type="submit"
            className="rounded-full px-3 py-1 text-[12.5px] font-medium underline underline-offset-4 transition-colors duration-200 hover:bg-white/15 hover:no-underline"
          >
            Leave preview
          </button>
        </form>
      </div>
    </div>
  );
}
