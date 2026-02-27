/**
 * RETRO DAILY — Main Application Script
 * Pure vanilla JS — no frameworks, no dependencies.
 */

/* ═══════════════════════════════════════════════════
   1. UTILITIES
   ═══════════════════════════════════════════════════ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function pad(n) { return String(n).padStart(2, '0'); }

/* ───── Toast ───── */
let toastTimer = null;
function showToast(msg, duration = 2000) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ═══════════════════════════════════════════════════
   2. STARFIELD CANVAS
   ═══════════════════════════════════════════════════ */
(function initStarfield() {
  const canvas = $('#starfield');
  const ctx    = canvas.getContext('2d');

  let stars = [];
  const STAR_COUNT = 160;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      dir:  Math.random() > 0.5 ? 1 : -1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
      s.alpha += s.speed * s.dir;
      if (s.alpha >= 1 || s.alpha <= 0.05) s.dir *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      // Warm amber/sepia star tones
      ctx.fillStyle = `rgba(220, 165, 100, ${s.alpha * 0.45})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();


/* ═══════════════════════════════════════════════════
   3. CUSTOM CURSOR
   ═══════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  const RING_LAG = 0.11;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });

  // Detect hover over interactive elements to enlarge ring
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('a, button, input, [role="button"]');
    document.body.classList.toggle('cursor-hover', !!el);
  });

  // Smooth trailing ring
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    rx = lerp(rx, mx, RING_LAG);
    ry = lerp(ry, my, RING_LAG);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ═══════════════════════════════════════════════════
   4. CLOCK + DATE + GREETING
   ═══════════════════════════════════════════════════ */
(function initClock() {
  const clockEl    = $('#clock');
  const dateEl     = $('#date-display');
  const greetingEl = $('#greeting');

  const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  function getGreeting(h) {
    if (h >= 5  && h < 12) return `Good morning, ${SITE_CONFIG.owner}.`;
    if (h >= 12 && h < 17) return `Good afternoon, ${SITE_CONFIG.owner}.`;
    if (h >= 17 && h < 21) return `Good evening, ${SITE_CONFIG.owner}.`;
    return `Good night, ${SITE_CONFIG.owner}.`;
  }

  function tick() {
    const now = new Date();
    const h   = now.getHours();
    const m   = now.getMinutes();
    const s   = now.getSeconds();

    // Clock with blinking colon
    const colon = s % 2 === 0 ? ':' : '·';
    clockEl.textContent = `${pad(h)}${colon}${pad(m)}${colon}${pad(s)}`;

    // Date
    dateEl.textContent =
      `${DAYS[now.getDay()]}  ·  ${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

    // Greeting (only update on minute change to avoid flicker)
    greetingEl.textContent = getGreeting(h);
  }

  tick();
  setInterval(tick, 1000);

  // Footer year
  const yearEl = $('#footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ═══════════════════════════════════════════════════
   5. DYNAMIC LINK GRID
   ═══════════════════════════════════════════════════ */
const shortcutMap = {}; // { 'g': { label, url } }

(function buildGrid() {
  const grid = $('#link-grid');
  if (!grid || typeof LINKS === 'undefined') return;

  for (const cat of LINKS) {
    // Section wrapper
    const section = document.createElement('section');
    section.className = 'category-section';
    section.setAttribute('aria-label', cat.category);

    // Header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = `
      <span class="category-icon" aria-hidden="true">${cat.icon || '▸'}</span>
      <span class="category-title">${cat.category}</span>
    `;

    // Items container
    const items = document.createElement('div');
    items.className = 'category-items';

    for (const link of cat.items) {
      const a = document.createElement('a');
      a.href   = link.url;
      a.target = '_blank';
      a.rel    = 'noopener noreferrer';
      a.className = 'link-tile';
      a.setAttribute('aria-label', link.label);

      const shortcutBadge = link.shortcut
        ? `<span class="tile-shortcut" aria-label="Shortcut: ${link.shortcut}" title="Press ${link.shortcut}">${link.shortcut}</span>`
        : '';

      a.innerHTML = `
        <span class="tile-label">${link.label}</span>
        ${shortcutBadge}
      `;

      // Register shortcut
      if (link.shortcut) {
        shortcutMap[link.shortcut.toLowerCase()] = { label: link.label, url: link.url };
      }

      // Ripple
      a.addEventListener('click', createRipple);
      a.addEventListener('mousedown', createRipple);

      items.appendChild(a);
    }

    section.appendChild(header);
    section.appendChild(items);
    grid.appendChild(section);
  }
})();


/* ═══════════════════════════════════════════════════
   6. RIPPLE EFFECT
   ═══════════════════════════════════════════════════ */
function createRipple(e) {
  const el   = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x    = e.clientX - rect.left - size / 2;
  const y    = e.clientY - rect.top  - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `
    width: ${size}px; height: ${size}px;
    left: ${x}px; top: ${y}px;
  `;
  el.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// Also bind to all ctrl-btns and engine-btns
document.addEventListener('DOMContentLoaded', () => {
  $$('.ctrl-btn, .engine-btn, .search-btn').forEach(btn => {
    btn.addEventListener('mousedown', createRipple);
  });
});


/* ═══════════════════════════════════════════════════
   7. KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════════════ */
(function initShortcuts() {
  const panel    = $('#shortcuts-panel');
  const backdrop = $('#shortcuts-backdrop');
  const closeBtn = $('#shortcuts-close');
  const list     = $('#shortcuts-list');
  const searchInput = $('#search-input');

  // Extra system shortcuts
  const systemShortcuts = [
    { key: '/',     label: 'Focus search bar'      },
    { key: '?',     label: 'Show keyboard shortcuts'},
    { key: 'ESC',   label: 'Close this panel'       },
    { key: 'T',     label: 'Toggle sepia mode'      },
    { key: 'K',     label: 'Toggle CRT scanlines'   },
    { key: 'B',     label: 'Toggle background music'},
  ];

  // Build shortcut list UI
  function buildShortcutUI() {
    list.innerHTML = '';

    // Link shortcuts from data
    for (const [key, val] of Object.entries(shortcutMap)) {
      const item = document.createElement('div');
      item.className = 'shortcut-item';
      item.innerHTML = `<kbd>${key.toUpperCase()}</kbd><span>${val.label}</span>`;
      list.appendChild(item);
    }

    // System shortcuts
    for (const s of systemShortcuts) {
      const item = document.createElement('div');
      item.className = 'shortcut-item';
      item.innerHTML = `<kbd>${s.key}</kbd><span>${s.label}</span>`;
      list.appendChild(item);
    }
  }

  function openPanel() {
    buildShortcutUI();
    panel.classList.add('show');
    backdrop.classList.add('show');
    panel.setAttribute('aria-hidden', 'false');
    backdrop.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    panel.classList.remove('show');
    backdrop.classList.remove('show');
    panel.setAttribute('aria-hidden', 'true');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
  $('#btn-shortcuts').addEventListener('click', openPanel);

  // Global keydown handler
  document.addEventListener('keydown', e => {
    const tag    = document.activeElement.tagName.toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
    const key    = e.key.toLowerCase();

    // Always allow ESC
    if (e.key === 'Escape') {
      closePanel();
      searchInput.blur();
      return;
    }

    // Focus search with /
    if (key === '/' && !typing) {
      e.preventDefault();
      searchInput.focus();
      return;
    }

    // Toggle shortcuts panel
    if (key === '?' && !typing) {
      panel.classList.contains('show') ? closePanel() : openPanel();
      return;
    }

    // Don't fire page shortcuts when typing
    if (typing) return;

    // System toggle shortcuts
    if (key === 't') { $('#btn-theme').click(); return; }
    if (key === 'k') { $('#btn-crt').click();   return; }
    if (key === 'b') { $('#btn-music').click();  return; }

    // Link shortcuts
    if (shortcutMap[key]) {
      const { label, url } = shortcutMap[key];
      showToast(`→ ${label}`);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  });
})();


/* ═══════════════════════════════════════════════════
   8. CRT TOGGLE
   ═══════════════════════════════════════════════════ */
(function initCRT() {
  const btn     = $('#btn-crt');
  const overlay = $('#crt-overlay');
  let   active  = false;

  btn.addEventListener('click', () => {
    active = !active;
    overlay.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active);
    showToast(active ? '↯ CRT ON' : '↯ CRT OFF');
  });
})();


/* ═══════════════════════════════════════════════════
   9. THEME TOGGLE (dark ↔ sepia)
   ═══════════════════════════════════════════════════ */
(function initTheme() {
  const btn  = $('#btn-theme');
  const html = document.documentElement;

  // Restore saved preference
  const saved = localStorage.getItem('retro-theme');
  if (saved) html.dataset.theme = saved;

  function setTheme(theme) {
    html.dataset.theme = theme;
    localStorage.setItem('retro-theme', theme);
    const isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', isDark);
    showToast(isDark ? '◑ DARK MODE' : '◑ VINTAGE SEPIA');
  }

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'sepia' : 'dark';
    setTheme(next);
  });
})();


/* ═══════════════════════════════════════════════════
   10. BACKGROUND MUSIC TOGGLE
   ═══════════════════════════════════════════════════ */
(function initMusic() {
  const btn   = $('#btn-music');
  const audio = $('#bg-music');
  const label = btn.querySelector('.music-label');
  let playing = false;

  if (!audio) return;

  // Set stream
  audio.src    = SITE_CONFIG.musicStream;
  audio.volume = 0.35;

  audio.addEventListener('error', () => {
    showToast('⚠ Stream unavailable');
    playing = false;
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('music-playing');
    if (label) label.textContent = 'MUSIC';
  });

  function updateUI() {
    btn.setAttribute('aria-pressed', playing);
    btn.classList.toggle('music-playing', playing);
    if (label) label.textContent = playing ? SITE_CONFIG.musicLabel : 'MUSIC';
  }

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      playing = false;
      showToast('♪ Music paused');
    } else {
      audio.play().catch(() => showToast('⚠ Click again to play'));
      playing = true;
      showToast(`♪ ${SITE_CONFIG.musicLabel}`);
    }
    updateUI();
  });
})();


/* ═══════════════════════════════════════════════════
   11. SEARCH BAR
   ═══════════════════════════════════════════════════ */
(function initSearch() {
  const form    = $('#search-form');
  const input   = $('#search-input');
  const engines = $$('.engine-btn');

  let activeEngine = 'google';

  engines.forEach(btn => {
    btn.addEventListener('click', () => {
      engines.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeEngine = btn.dataset.engine;
      input.focus();
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    const base = SITE_CONFIG.searchEngines[activeEngine];
    window.open(base + encodeURIComponent(q), '_blank', 'noopener,noreferrer');
    input.value = '';
  });
})();


/* ═══════════════════════════════════════════════════
   12. MARQUEE
   ═══════════════════════════════════════════════════ */
(function initMarquee() {
  const track = $('#marquee-track');
  if (!track) return;

  // Duplicate content for seamless loop
  const text = SITE_CONFIG.marqueeText + '    ';
  track.textContent = text + text;
})();


/* ═══════════════════════════════════════════════════
   13. SITE TITLE
   ═══════════════════════════════════════════════════ */
(function setTitle() {
  const titleEl = $('#site-title');
  if (titleEl) titleEl.textContent = SITE_CONFIG.title;
  document.title = SITE_CONFIG.title;
})();


/* ═══════════════════════════════════════════════════
   14. BOOT SEQUENCE (welcome toast)
   ═══════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => showToast('» SYSTEM ONLINE  |  Press ? for shortcuts', 3000), 800);
});


/* ═══════════════════════════════════════════════════
   15. HERO BANNER — dynamic owner name
   ═══════════════════════════════════════════════════ */
(function initHero() {
  const heroTitle = $('#hero-title');
  if (heroTitle && SITE_CONFIG.owner) {
    heroTitle.innerHTML = `VINTAGE <em>MADE</em> DAILY &nbsp;·&nbsp; <em>${SITE_CONFIG.owner.toUpperCase()}'S</em> PORTAL`;
  }
})();


/* ═══════════════════════════════════════════════════
   16. TERMINAL WIDGET
   ═══════════════════════════════════════════════════ */
(function initTerminal() {
  const body      = $('#terminal-body');
  const input     = $('#terminal-input');
  const btnClear  = $('#term-btn-clear');
  const btnHelp   = $('#term-btn-help');
  const dotClose  = $('#term-dot-close');

  if (!body || !input) return;

  // Command history
  const history  = [];
  let   histIdx  = -1;

  // ── Build flat link lookup ──
  const linkIndex = {}; // 'github' → url
  const allLinks  = [];
  if (typeof LINKS !== 'undefined') {
    for (const cat of LINKS) {
      for (const item of cat.items) {
        const key = item.label.toLowerCase().replace(/\s+/g, '');
        linkIndex[key] = item.url;
        allLinks.push({ label: item.label, url: item.url, cat: cat.category });
      }
    }
  }

  // ── Output helpers ──
  function line(text, cls = 'output') {
    const el = document.createElement('div');
    el.className = `term-line ${cls}`;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function lineHTML(html, cls = 'output') {
    const el = document.createElement('div');
    el.className = `term-line ${cls}`;
    el.innerHTML = html;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function blank() { line('', 'output'); }

  function echoPrompt(cmd) {
    line(`❯  ${cmd}`, 'prompt');
  }

  // ── Print boot banner ──
  function printBanner() {
    const lines = [
      '  ██████╗ ███████╗████████╗██████╗  ██████╗ ',
      '  ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗',
      '  ██████╔╝█████╗     ██║   ██████╔╝██║   ██║',
      '  ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║',
      '  ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝',
      '  ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ',
    ];
    lines.forEach(l => line(l, 'banner'));
    line('  RETRO://TERMINAL  v1.0.0  —  Your Personal Portal', 'info');
    line('', 'muted');
    line('  Type  help  for available commands.', 'muted');
    blank();
  }

  // ── Command definitions ──
  const COMMANDS = {

    help() {
      blank();
      line('  ┌─── AVAILABLE COMMANDS ──────────────────────────┐', 'info');
      line('  │  help          Show this help message            │', 'muted');
      line('  │  ls            List all quick-links              │', 'muted');
      line('  │  open <name>   Open a link by name or shortcut   │', 'muted');
      line('  │  find <query>  Search links by keyword           │', 'muted');
      line('  │  date          Show current date & time          │', 'muted');
      line('  │  weather       Open weather in browser           │', 'muted');
      line('  │  crt           Toggle CRT scanlines              │', 'muted');
      line('  │  theme         Toggle sepia / dark mode          │', 'muted');
      line('  │  music         Toggle background music           │', 'muted');
      line('  │  about         About this portal                 │', 'muted');
      line('  │  clear  /  cls Clear terminal                    │', 'muted');
      line('  │  whoami        Who you are                       │', 'muted');
      line('  └─────────────────────────────────────────────────┘', 'info');
      blank();
    },

    ls() {
      blank();
      line('  QUICK-LINKS INDEX:', 'info');
      if (typeof LINKS !== 'undefined') {
        for (const cat of LINKS) {
          line(`  /${cat.category.toLowerCase()}/`, 'info');
          for (const item of cat.items) {
            const shortKey = item.label.toLowerCase().replace(/\s+/g, '');
            const badge    = item.shortcut ? ` [${item.shortcut}]` : '';
            line(`    · ${item.label}${badge}  →  ${shortKey}`, 'muted');
          }
        }
      }
      blank();
    },

    open(args) {
      if (!args) { line('  Usage: open <link-name>', 'error'); return; }
      const key = args.toLowerCase().replace(/\s+/g, '');
      if (linkIndex[key]) {
        line(`  Opening ${args}...`, 'success');
        blank();
        window.open(linkIndex[key], '_blank', 'noopener,noreferrer');
        showToast(`→ ${args}`);
      } else {
        // Try partial match
        const match = Object.keys(linkIndex).find(k => k.includes(key) || key.includes(k));
        if (match) {
          line(`  Opening ${match}...`, 'success');
          blank();
          window.open(linkIndex[match], '_blank', 'noopener,noreferrer');
        } else {
          line(`  Not found: "${args}". Try  ls  to list all links.`, 'error');
          blank();
        }
      }
    },

    find(args) {
      if (!args) { line('  Usage: find <query>', 'error'); return; }
      const q       = args.toLowerCase();
      const results = allLinks.filter(l =>
        l.label.toLowerCase().includes(q) || l.cat.toLowerCase().includes(q)
      );
      blank();
      if (results.length === 0) {
        line(`  No links matched "${args}".`, 'error');
      } else {
        line(`  Found ${results.length} result(s):`, 'info');
        results.forEach(r => line(`    · [${r.cat}]  ${r.label}  →  ${r.url}`, 'muted'));
      }
      blank();
    },

    date() {
      const now = new Date();
      blank();
      line(`  Date  : ${now.toDateString()}`, 'info');
      line(`  Time  : ${now.toLocaleTimeString()}`, 'info');
      line(`  Unix  : ${Math.floor(now.getTime() / 1000)}`, 'muted');
      blank();
    },

    weather() {
      line('  Opening weather...', 'success');
      window.open('https://wttr.in/?format=3', '_blank', 'noopener,noreferrer');
      blank();
    },

    crt() {
      $('#btn-crt').click();
      const on = $('#crt-overlay').classList.contains('active');
      line(`  CRT scanlines ${on ? 'ON' : 'OFF'}.`, 'info');
      blank();
    },

    theme() {
      $('#btn-theme').click();
      const t = document.documentElement.dataset.theme;
      line(`  Theme switched to: ${t.toUpperCase()}`, 'info');
      blank();
    },

    music() {
      $('#btn-music').click();
      blank();
    },

    about() {
      blank();
      line('  ┌────────────────────────────────────────────────┐', 'info');
      line(`  │  RETRO://DAILY — Personal Start Page           │`, 'banner');
      line(`  │  Owner : ${(SITE_CONFIG.owner + '                           ').slice(0,37)}│`, 'muted');
      line(`  │  Stack : Pure HTML + CSS + Vanilla JS          │`, 'muted');
      line(`  │  Theme : Modern Vintage (Dark Sepia)           │`, 'muted');
      line(`  │  Year  : ${new Date().getFullYear()}                                    │`, 'muted');
      line('  └────────────────────────────────────────────────┘', 'info');
      blank();
    },

    whoami() {
      blank();
      line(`  ${SITE_CONFIG.owner} — Vintage portal operator`, 'success');
      line('  You are seen. You are known. You are retro.', 'muted');
      blank();
    },

    clear() { body.innerHTML = ''; },
    cls()   { body.innerHTML = ''; },

    // Easter eggs
    hello()   { blank(); line('  Hey there, traveller. 👋', 'success'); blank(); },
    hi()      { COMMANDS.hello(); },
    matrix()  {
      blank();
      line('  There is no spoon.', 'info');
      line('  (But there are links. Use  ls  to see them.)', 'muted');
      blank();
    },
    hack()    {
      blank();
      line('  Initiating hack sequence...', 'error');
      setTimeout(() => line('  Just kidding. This is a start page, not Mr. Robot.', 'muted'), 600);
      setTimeout(() => blank(), 800);
    },
  };

  // ── Process input ──
  function process(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    history.unshift(trimmed);
    histIdx = -1;

    echoPrompt(trimmed);

    const [cmd, ...rest] = trimmed.split(' ');
    const args = rest.join(' ').trim() || null;
    const fn   = COMMANDS[cmd.toLowerCase()];

    if (fn) {
      fn(args);
    } else {
      line(`  command not found: ${cmd}. Type  help  for commands.`, 'error');
      blank();
    }
  }

  // ── Input events ──
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      process(val);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      histIdx = Math.min(histIdx + 1, history.length - 1);
      input.value = history[histIdx];
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIdx = Math.max(histIdx - 1, -1);
      input.value = histIdx === -1 ? '' : history[histIdx];
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.toLowerCase().trim();
      if (!partial) return;
      const cmds  = Object.keys(COMMANDS);
      const match = cmds.find(c => c.startsWith(partial)) ||
                    Object.keys(linkIndex).find(k => k.startsWith(partial));
      if (match) input.value = match;
    }
  });

  // Click titlebar to focus input
  $('#terminal-titlebar').addEventListener('click', () => input.focus());

  // Buttons
  btnClear.addEventListener('click', () => { body.innerHTML = ''; input.focus(); });
  btnHelp.addEventListener('click',  () => { COMMANDS.help(); input.focus(); });
  dotClose.addEventListener('click', () => { body.innerHTML = ''; input.focus(); });

  // ── Boot ──
  printBanner();
  input.focus();
})();
