# OpsConductor — Brand Assets

## Contents

### SVG/
- `icon/opsconductor-icon.svg`          — Static icon mark (dark mode)
- `icon/opsconductor-icon-light.svg`    — Static icon mark (light mode)
- `icon/opsconductor-icon-animated.svg` — Self-animating SVG (CSS animations)
- `wordmark/opsconductor-wordmark.svg`  — Wordmark only (Ops·Conductor)
- `lockup/opsconductor-lockup.svg`      — Full lockup: icon + wordmark

### PNG/
- `icon-transparent/`  — Icon on transparent bg, 16–1024px
- `icon-dark-bg/`      — Icon on #07070A dark bg, 256–1024px
- `icon-light-bg/`     — Icon on #F4F4F7 light bg (cerulean), 256–1024px
- `app-icon/`          — 1024px with macOS-style rounded corners

### Favicon/
- `favicon-16x16.png`    — Browser tab (PNG)
- `favicon-32x32.png`    — Browser tab retina (PNG)
- `apple-touch-icon.png` — iOS home screen (180×180)
- `favicon-dark.ico`     — Multi-res ICO: 16, 32, 48px
- `app-icon.ico`         — Multi-res ICO: 16, 32, 48, 256px

### Animated/
- `opsconductor-icon-animated.svg` — CSS-animated SVG (preferred)
- `opsconductor-icon-animated.gif` — Animated GIF (email / legacy)

### PNG/social/
- `opsconductor-og-image.png` — 1200×630 Open Graph / social card

## Colours
| Token    | Dark mode  | Light mode |
|----------|------------|------------|
| Accent   | #00C2FF    | #0077B6    |
| Canvas   | #07070A    | #F4F4F7    |
| Text     | #EEEEF2    | #0A0A12    |

## Usage
- Use SVG wherever possible (scales perfectly)
- Use animated SVG for web splash / loading states
- Use animated GIF for email headers / legacy contexts
- ICO files contain multiple resolutions in one file
- apple-touch-icon.png: place at site root, link in <head>

## Fonts
Wordmark uses DM Sans: weight 200 (Ops) + weight 800 (Conductor)
https://fonts.google.com/specimen/DM+Sans
