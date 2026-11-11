# Profile Motion — reproducible portfolio production

Standalone source project for the TeoZ08 GitHub Profile README. All interface screenshots originate from the user's existing public project and are preserved unmodified as source material.

## Editorial concept

- Preserve the original cloud/tree/lake portrait (no new artificial tech artwork).
- Extend its dark lake reflections into an animated technical landscape.
- Present four clickable real project covers with restrained motion.
- Render a full 31-second Remotion film to be opened on demand.
- Preserve Markdown equivalents: project links, descriptions and technical information.

## Build

Requires Node.js 20+, npm, Google Chrome / Chrome headless, and FFmpeg with WebP support.

Run `npm ci` in this directory, then `npm run render`. From the repository root, `node motion/scripts/validate.mjs` verifies the outputs. `npm run studio` opens the compositions. `npm run render -- --quick` skips the full film while making thumbnail assets.

Render compositions: `Journey`, `Depth`, `FilmCover`, and `Card-jarvis`, `Card-aquaia`, `Card-unapi`, `Card-portfolio`.

The editable source files and original screenshots are in `motion/`. The published images and video are in `assets/`.

## GitHub publication

The optional manual workflow `.github/workflows/render-profile-motion.yml` recreates all assets without modifying project content or third-party repositories. Do not add scheduled regeneration unless required. Animation loops do not depend on data fetching.

The README itself does not execute JavaScript: images and links are deliberately native GitHub Markdown components. The video opens as a separate file to avoid autoplay, and all source images are accessible via descriptive alt attributes. Dark background matching prevents a visible seam at the bottom of the existing hero.

## Visual standards

Ink `#080B10`, ivory `#EFF0EB`, muted gray `#A3ADB0`, restrained gold `#B59B61`. Prefer authentic screenshots over illustrations and avoid card-like neon effects.

## Dedicated playback

The public showcase is served by GitHub Pages from `/docs` at https://teoz08.github.io/. It contains a native HTML5 video player and a responsive, accessible project gallery. The render script synchronizes the generated media into `docs/media/`.
