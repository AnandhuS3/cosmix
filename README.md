# COSMIX

A personal daily dashboard built in the spirit of old-web start pages and Neocities aesthetics. Open it once in the morning and everything you need is right there — no login, no tracking, no noise.

---

## What It Is

This is not a portfolio. It is a private browser start page — a single HTML file you open locally every day to jump straight to your apps, tools, and links. The design takes inspiration from 90s internet portals and early 2000s fan sites, filtered through a modern vintage lens: dark brown backgrounds, warm rust-salmon accents, Bebas Neue display type, and a heavy film-grain texture.

---

## Structure

The project root contains `index.html` as the entry point. Styles live in the `css/` folder, all runtime logic in `js/`, your personal link data in `data/links.js`, and images or custom assets in `assets/`. The only file you ever need to edit day-to-day is `data/links.js`.

---

## How to Use

Just open `index.html` in any modern browser. No server, no build step, no install.

To make it your browser's default new-tab page, use a browser extension like New Tab Redirect and point it to the local file path.

---

## Personalising Your Links

All links live in `data/links.js`. That is the only file you need to touch to add, remove, or rename links. Each link can have an optional single-key keyboard shortcut. Categories and their icons are fully configurable. The grid renders itself automatically from whatever data you put there.

---

## Features at a Glance

**Dashboard**
- Live digital clock with blinking colon separator
- Dynamic date display updated every second
- Time-aware greeting that changes between morning, afternoon, evening, and night
- Vintage hero banner with diagonal texture and ribbon badge

**Links**
- Four default categories — Social, Music, Work, Projects
- All links open in a new tab
- Smooth hover glow with a warm amber lift effect
- Subtle floating animation on each tile, paused on hover

**Terminal Widget**
- A fully interactive in-page terminal at the bottom of the dashboard
- Supports commands for opening links, listing all shortcuts, searching by keyword, checking the date, toggling theme and CRT mode, and more
- Command history navigable with the up and down arrow keys
- Tab autocomplete for both commands and link names

**Controls (toolbar)**
- CRT scanline overlay toggle — adds a retro phosphor-screen feel
- Dark / Sepia mode toggle — switches between deep brown-dark and warm golden-amber
- Background music toggle — streams a lo-fi ambient radio station
- Keyboard shortcuts panel — press `?` anywhere to see all bindings

**Cursor**
- Custom image cursor using your own asset from the `assets/` folder
- Scales slightly when hovering over interactive elements

**Keyboard Shortcuts**
- `/` — focus the search bar
- `?` — open the shortcuts panel
- `G` — GitHub, `M` — Gmail, `S` — Spotify, and more (all configurable in `links.js`)
- `T` — toggle theme, `K` — toggle CRT, `B` — toggle music

**Search**
- Inline search bar at the bottom, switches between Google and DuckDuckGo
- Results open in a new tab

**Aesthetic Details**
- Bebas Neue for display headings, VT323 for the clock, Playfair Display for serif accents, Share Tech Mono for body text
- Heavy film-grain SVG overlay for the vintage photo texture
- Animated twinkling starfield in warm amber tones
- Radial vignette darkening the screen edges
- Seamless marquee footer with custom message text

---

## Customisation Reference

| What | Where |
|---|---|
| Your name | `SITE_CONFIG.owner` in `links.js` |
| Site title | `SITE_CONFIG.title` in `links.js` |
| Marquee text | `SITE_CONFIG.marqueeText` in `links.js` |
| Music stream URL | `SITE_CONFIG.musicStream` in `links.js` |
| All links and shortcuts | The `LINKS` array in `links.js` |
| Cursor image | Replace `assets/luffy.png` with any PNG |
| Accent colour | `--accent` CSS variable in `style.css` |

---

## Tech Stack

Pure HTML, CSS, and vanilla JavaScript. No frameworks. No npm. No build tools. No external dependencies beyond Google Fonts loaded via CDN. The entire project is a handful of flat files that work by double-clicking `index.html`.

---

## Aesthetic Inspiration

- Neocities personal homepages from the early 2000s
- Old-web browser start pages (MyYahoo, iGoogle era)
- Modern Vintage design style — dark warm backgrounds, condensed display type, ribbon badges, diagonal hatching
- Lo-fi and retrowave visual culture

---

*Handcrafted with nostalgia.*
