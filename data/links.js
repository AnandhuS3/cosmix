/**
 * RETRO DAILY — Link Data
 * Edit this file to update your links, labels, and keyboard shortcuts.
 *
 * Each category renders as one grid section.
 * `shortcut` fires the link when that key is pressed (case-insensitive).
 * Set `shortcut: null` to disable key binding for that link.
 * `icon` is a Unicode/emoji character shown before the label.
 */

const SITE_CONFIG = {
  title: "RETRO://DAILY",
  owner: "Anandhu",
  marqueeText:
    "★ Welcome to my personal portal  ★  The internet, but make it yours  ★  Stay focused. Stay retro.  ★  All systems nominal  ★  Loading memories...  ★",
  searchEngines: {
    google: "https://www.google.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q=",
  },
  // A public lo-fi / ambient radio stream (replace with your own file if preferred)
  musicStream: "https://ice6.somafm.com/groovesalad-128-mp3",
  musicLabel: "GROOVE SALAD FM",
};

const LINKS = [
  {
    category: "SOCIAL",
    icon: "◈",
    items: [
      { label: "Instagram",    url: "https://instagram.com",      shortcut: "I" },
      { label: "Twitter / X",  url: "https://x.com",              shortcut: null },
      { label: "WhatsApp Web", url: "https://web.whatsapp.com",   shortcut: "W" },
      { label: "YouTube",      url: "https://youtube.com",        shortcut: "U" },
    ],
  },
  {
    category: "MUSIC",
    icon: "♫",
    items: [
      { label: "Spotify",       url: "https://open.spotify.com",                shortcut: "S" },
      { label: "Playlist 01",   url: "https://open.spotify.com/playlist/37i9dQZF1DX688wU47emR9/",      shortcut: "P" },
      { label: "Playlist 02",   url: "https://open.spotify.com/playlist/",      shortcut: null },
      { label: "SoundCloud",    url: "https://soundcloud.com",                  shortcut: null },
    ],
  },
  {
    category: "WORK",
    icon: "▸",
    items: [
      { label: "Gmail",    url: "https://mail.google.com",   shortcut: "M" },
      { label: "GitHub",   url: "https://github.com",        shortcut: "G" },
      { label: "LinkedIn", url: "https://linkedin.com",      shortcut: "L" },
      { label: "Notion",   url: "https://notion.so",         shortcut: "N" },
    ],
  },
  {
    category: "PROJECTS",
    icon: "◉",
    items: [
      { label: "DDS",               url: "#",                   shortcut: "D" },
      { label: "Personal Projects", url: "#",                   shortcut: "P" },
      { label: "College Portal",    url: "#",                   shortcut: "C" },
    ],
  },
];
