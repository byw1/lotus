# Photographs

Files here are served straight from the site root: `public/photos/2026/boats.jpg`
is at `/photos/2026/boats.jpg`. That path is what goes in the `src` field in
[`src/config/gallery.ts`](../../src/config/gallery.ts), which is the file that
decides what appears on `/gallery` and in what order.

**Read the four rules at the top of that config file before you add anything.**
They are about consent and credit, not about files, and they are the part of
this that matters.

## Adding photographs

1. **Put them in a folder for the year**: `public/photos/2027/`.

2. **Resize them and strip the location data.** Phones write GPS coordinates
   into every photograph, and a repository carrying forty full-resolution
   JPEGs is one nobody can clone. One command does both:

   ```bash
   # ImageMagick 7. Use `convert` instead of `magick` on ImageMagick 6.
   magick mogrify -strip -resize '2000x2000>' -quality 82 public/photos/2027/*.jpg
   ```

   `-strip` removes the EXIF block, including the GPS tags. `2000x2000>` only
   ever shrinks, so running it twice does not degrade anything. Aim for under
   about 500 KB a file; the site resizes them again for each screen, so there
   is nothing to gain from more.

   No ImageMagick? macOS Preview (Tools → Adjust Size) and Windows Photos both
   resize, but **neither reliably strips location data** — on macOS use
   Tools → Show Inspector and remove the location, or run
   `exiftool -all= photo.jpg`.

3. **Name them for what they are**, in lower case with hyphens:
   `dragon-boats-red-black.jpg`, not `IMG_4471.jpg`. The filename is what the
   next person searches when they are looking for a photograph of the boats.

4. **Add an entry per photograph** to `src/config/gallery.ts`. Every one needs
   `alt` and `credit`.

5. Open a pull request. The gallery page rebuilds itself around the list.

## Formats

JPEG for photographs, PNG only for graphics with flat colour or transparency.
Do not commit HEIC — Safari will show it and nothing else will. The site
converts everything to WebP and AVIF on the way out, so there is no reason to
convert by hand.

## A note on the preview gate

Files in this directory are served without going through the preview gate, the
same as the CSS and the fonts — see the matcher at the bottom of
`src/proxy.ts`. Anyone with the URL of a photograph can open it while the rest
of the site is still gated. That is fine for festival photographs, which are
going to be public anyway. Do not use this directory as a private staging area.
