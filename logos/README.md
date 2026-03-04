# OpsConductor Logo System v2

## File Structure

```
opsconductor-logos/
├── primary/           — Stacked lockup (icon + two-line wordmark)
│   ├── primary-dark.svg       Dark background
│   ├── primary-light.svg      Light background
│   └── primary-amber.svg      Amber background
│
├── horizontal/        — Single-line lockup for navbars
│   ├── horizontal-dark.svg    Dark background
│   └── horizontal-white.svg   White background
│
├── icon/              — Icon mark only (no wordmark)
│   ├── icon-color-dark.svg    Full color, transparent bg (use on dark)
│   ├── icon-color-light.svg   Full color, transparent bg (use on light)
│   ├── icon-reversed-amber.svg  Amber fill background
│   ├── icon-mono-white.svg    All white (use on any dark bg)
│   └── icon-mono-black.svg    All black (use on any light bg)
│
├── favicon/           — Size-optimised app icons
│   ├── app-icon-120-dark.svg  120px, dark bg, rounded rect
│   ├── app-icon-120-amber.svg 120px, amber bg, rounded rect
│   ├── favicon-64.svg         64px, dark bg
│   ├── favicon-32.svg         32px, amber bg (high contrast at small size)
│   └── favicon-16.svg         16px, amber bg, simplified (arc + slash only)
│
└── wordmark/          — Text only, no icon
    ├── wordmark-dark.svg      For dark backgrounds
    └── wordmark-light.svg     For light backgrounds
```

## Brand Colors

| Name   | Hex       | Use                          |
|--------|-----------|------------------------------|
| Void   | #080C14   | Primary background           |
| Abyss  | #0F1520   | Secondary background         |
| Wire   | #1C2535   | Borders, dividers            |
| Signal | #F59E0B   | Primary accent, arc color    |
| Ember  | #D97706   | Accent on light backgrounds  |
| Cloud  | #F0F4F8   | Primary text on dark         |

## Font

Wordmark uses **Syne** (Google Fonts):
- OPS: Syne 800
- CONDUCTOR: Syne 700

## Usage Notes

- Always maintain clear space equal to the height of the "O" on all sides
- At 32px and below, use the amber-background favicon variants for maximum contrast
- The 16px favicon omits the dot — this is intentional for legibility
- Do not recolor, stretch, or rotate the mark
- Do not place the transparent icon on a mid-grey background (insufficient contrast)
