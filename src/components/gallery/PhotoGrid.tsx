"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Photo } from "@/config/gallery";
import { cn } from "@/lib/utils";

/**
 * A year's photographs, and the lightbox that opens over them.
 *
 * Every tile is a real link to the image file, and the lightbox is layered on
 * top by cancelling the click. With JavaScript off — or before the bundle has
 * arrived — the grid still works: a tap opens the photograph itself, which is
 * a worse experience than the lightbox and an infinitely better one than a
 * button that does nothing.
 *
 * The lightbox is a native `<dialog>` opened with `showModal()`. That is not
 * laziness; it is the only way to get the focus trap, the inert background,
 * Escape-to-close and the top-layer stacking right, and all the hand-rolled
 * versions of those are subtly broken. What is left to do by hand is the two
 * things `<dialog>` does not cover: arrow-key paging, and putting focus back
 * on the thumbnail that was clicked rather than dropping it on <body>.
 */

/**
 * How many rows and columns a photograph takes in the mosaic.
 *
 * Everything is a whole number of rows, which is what makes the grid
 * tessellate. `feature` is the only thing that takes a second column.
 */
function tileSpan(photo: Photo): string {
  if (photo.feature) return "col-span-2 row-span-3";
  if (photo.shape === "portrait") return "row-span-3";
  return "row-span-2";
}

export function PhotoGrid({ photos, label }: { photos: readonly Photo[]; label: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  /** The tile to hand focus back to. Read on close, so it must outlive it. */
  const lastTrigger = useRef<number>(0);

  const open = useCallback((index: number) => {
    lastTrigger.current = index;
    setOpenIndex(index);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        // Wraps, so the last photograph goes back to the first rather than
        // landing on a dead arrow key.
        const next = (current + delta + photos.length) % photos.length;
        lastTrigger.current = next;
        return next;
      });
    },
    [photos.length],
  );

  // showModal() is imperative and cannot be expressed as a prop, so opening is
  // an effect on the index rather than something done in the click handler —
  // that way the dialog is always in whatever state `openIndex` says it is.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) dialog.close();
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, step]);

  /*
   * Fires for every way the dialog can close, including the Escape key, which
   * the browser handles without telling React. Without this the state says
   * open, the dialog is shut, and the next click does nothing at all.
   */
  const handleClose = useCallback(() => {
    setOpenIndex(null);
    triggerRefs.current[lastTrigger.current]?.focus();
  }, []);

  const current = openIndex === null ? null : photos[openIndex];

  return (
    <>
      {/*
        A mosaic on a fixed row height rather than a grid of aspect-ratio
        boxes. Tiles of different shapes only tessellate if they are all
        multiples of one row, so the row is the unit: a wide photograph takes
        two of them, an upright one takes three, and a featured one takes two
        columns as well. Give the tiles their own aspect ratios instead and
        every row gets sized by its tallest member, leaving a band of empty
        page under the short ones.

        The caption belongs to the lightbox for the same reason — text under a
        tile is extra height inside a box whose height is already spoken for.
      */}
      <ul
        className={cn(
          "mt-10 grid gap-3 sm:mt-12 sm:gap-4",
          "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          "auto-rows-[4.5rem] sm:auto-rows-[5.5rem] lg:auto-rows-[6rem]",
        )}
      >
        {photos.map((photo, index) => (
          <li key={photo.src} className={tileSpan(photo)}>
            <a
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              href={photo.src}
              onClick={(event) => {
                // Let a modified click do what the browser would: open the
                // file in a new tab, save it, copy the address.
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                open(index);
              }}
              aria-label={photo.alt}
              className={cn(
                "group border-line bg-surface relative block h-full w-full overflow-hidden rounded-xl border",
                "focus-visible:ring-focus focus-visible:ring-2 focus-visible:ring-offset-2",
              )}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                /*
                 * Two columns on a phone, four on a wide screen — so a tile is
                 * never more than about half the viewport and usually a
                 * quarter. Getting this wrong is invisible on a fast laptop
                 * and doubles the bytes on a phone in a park in July.
                 */
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              />
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        onClick={(event) => {
          // A click on the dialog itself is a click on the backdrop: the
          // content is in a child, and clicks on it never reach here.
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        aria-label={`${label} — photograph viewer`}
        className={cn(
          "text-fg m-auto w-full max-w-5xl bg-transparent p-4 backdrop:bg-[rgba(10,26,40,0.86)]",
          "backdrop:backdrop-blur-sm",
        )}
      >
        {current ? (
          <div className="flex flex-col gap-4">
            <div className="relative mx-auto max-h-[74vh] w-full">
              <Image
                src={current.src}
                alt={current.alt}
                width={1600}
                height={1200}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="mx-auto h-auto max-h-[74vh] w-auto rounded-lg object-contain"
                priority
              />
            </div>

            <div className="bg-bg-raised border-line flex flex-wrap items-center justify-between gap-4 rounded-xl border px-4 py-3">
              <div className="min-w-0">
                <p className="text-fg text-[14.5px] leading-snug">
                  {current.caption ?? current.alt}
                </p>
                <p className="text-fg-subtle mt-1 text-[12.5px]">
                  {current.credit} · {openIndex! + 1} of {photos.length}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <LightboxButton label="Previous photograph" onClick={() => step(-1)}>
                  <ChevronLeft aria-hidden="true" className="size-5" />
                </LightboxButton>
                <LightboxButton label="Next photograph" onClick={() => step(1)}>
                  <ChevronRight aria-hidden="true" className="size-5" />
                </LightboxButton>
                <LightboxButton label="Close" onClick={() => dialogRef.current?.close()}>
                  <X aria-hidden="true" className="size-5" />
                </LightboxButton>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

function LightboxButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "border-line text-fg-muted hover:text-fg hover:bg-surface grid size-10 place-items-center rounded-full border",
        "focus-visible:ring-focus transition-colors duration-200 focus-visible:ring-2",
      )}
    >
      {children}
    </button>
  );
}
