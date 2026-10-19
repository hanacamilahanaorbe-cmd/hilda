// hilda.log — portátil infectado con malware. Windows XP/95 retro + CRT.
// Hilda (25, estudiante) y su versión digital .jpg + Pip (cursor) están
// atrapados en el sistema operativo intentando salvar sus archivos.
// Sin contraseñas, sin backend, sin cuentas. Funciona offline.

// ============================================================
// Utils
// ============================================================
const $ = (sel) => document.querySelector(sel);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PROJECT_NAME = "hilda.log";

// Amenazas de malware detectadas en el sistema de Hilda.
const THREATS = ["MEMENTO.EXE", "ANEMONIA.CMD", "COOLDRAKE.HTML"];

// ============================================================
// Settings (localStorage; no database)
// ============================================================
const SETTINGS_KEY = "hildalog_settings";
const defaultSettings = { sound: true, volume: 0.5, visualFx: true };
let settings = loadSettings();

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}
function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch {}
}
function applyFxClass() {
  document.body.classList.toggle("fx-off", !settings.visualFx);
}

// ============================================================
// Audio (Web Audio API beeps — no external files)
// ============================================================
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { audioCtx = null; }
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
function beep(freq = 880, dur = 0.06, type = "square", vol = null) {
  if (!settings.sound) return;
  ensureAudio();
  if (!audioCtx) return;
  const v = vol == null ? settings.volume : vol;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, v * 0.3), t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}
const bootBeep = () => beep(660, 0.05, "square");
const errorBeep = () => { beep(220, 0.18, "sawtooth"); setTimeout(() => beep(180, 0.22, "sawtooth"), 120); };
const clickBeep = () => beep(1200, 0.02, "square", 0.4);

// ============================================================
// Saves
// ============================================================
const SAVES_KEY = "hildalog_saves";
function getSaves() {
  try {
    const raw = localStorage.getItem(SAVES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ============================================================
// Screens
// ============================================================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
}
function glitchFlash() {
  $("#screen").classList.add("glitch-flash");
  setTimeout(() => $("#screen").classList.remove("glitch-flash"), 260);
}

// ============================================================
// Boot sequence (Spanish, malware detection)
// ============================================================
const bootLines = [
  { t: `CARGANDO ${PROJECT_NAME}...`, cls: "ok" },
  { t: "DETECTANDO MALWARE EN SISTEMA OPERATIVO...", cls: "ok" },
  { t: "ESCANEAR PAPELERA, ARCHIVOS E INTERNET...", cls: "ok" },
  { t: "ERROR: AMENAZAS DESCONOCIDAS DETECTADAS", cls: "err", glitch: true },
  { t: "RECUPERANDO ESCRITORIO DE HILDA...", cls: "ok" },
  { t: `${PROJECT_NAME} INICIADO CON ERRORES CRÍTICOS.`, cls: "err" },
];

async function typeLine(el, text, cls, delay = 16) {
  const span = document.createElement("span");
  if (cls) span.className = cls;
  el.appendChild(span);
  for (const ch of text) {
    span.textContent += ch;
    if (Math.random() < 0.05) await wait(40);
    await wait(delay);
  }
  el.appendChild(document.createTextNode("\n"));
}

async function runBoot() {
  const log = $("#boot-log");
  const cursor = $("#boot-cursor");
  cursor.style.display = "none";
  log.textContent = "";
  for (const line of bootLines) {
    if (line.glitch) { glitchFlash(); errorBeep(); }
    else bootBeep();
    await typeLine(log, line.t, line.cls);
    await wait(280);
  }
  cursor.style.display = "inline";
  await wait(700);
  enterDesktop();
}

function enterDesktop() {
  showScreen("desktop");
  startClock();
  setTimeout(() => { if (Math.random() < 0.5) glitchFlash(); }, 1200);
}

// ============================================================
// Clock
// ============================================================
let clockTimer = null;
function startClock() {
  const clock = $("#clock");
  const tick = () => {
    const d = new Date();
    clock.textContent =
      String(d.getHours()).padStart(2, "0") + ":" +
      String(d.getMinutes()).padStart(2, "0");
  };
  tick();
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = setInterval(tick, 1000);
}

// ============================================================
// BSOD
// ============================================================
const bsodMessages = [
  { t: `SE HA DETECTADO UN ERROR INESPERADO EN ${PROJECT_NAME}.`, cls: "err" },
  { t: "" },
  { t: "Windows ha sido detenido para proteger el equipo." },
  { t: "" },
  { t: "AMENAZA DE MALWARE CRÍTICA...", cls: "accent" },
  { t: "REVISANDO PAPELERA DE RECICLAJE Y FOTOGRAFÍAS...", cls: "accent" },
  { t: "" },
  { t: "Si esta es la primera vez que ves esta pantalla," },
  { t: "reinicia el equipo. Si vuelve a aparecer, no apagues" },
  { t: "el portátil: Hilda y Pip aún están dentro." },
];

async function triggerBsod(returnTo = "desktop") {
  clickBeep();
  const bsod = $("#bsod");
  const body = $("#bsod-body");
  const percent = $("#bsod-percent");
  const barFill = $("#bsod-bar-fill");
  bsod.classList.add("active");
  bsod.classList.add("glitching");
  errorBeep();
  body.innerHTML = "";
  for (const msg of bsodMessages) {
    const div = document.createElement("div");
    if (msg.cls) div.className = msg.cls;
    div.textContent = msg.t;
    body.appendChild(div);
    await wait(190);
  }
  let p = 0;
  while (p < 100) {
    p += Math.max(1, Math.round((100 - p) * 0.08) + 1);
    if (p > 100) p = 100;
    percent.textContent = p + "%";
    barFill.style.width = p + "%";
    if (p % 10 === 0) beep(440 + p * 4, 0.03, "square", 0.25);
    await wait(90);
  }
  await wait(500);
  glitchFlash();
  await wait(200);
  bsod.classList.remove("glitching");
  bsod.classList.remove("active");
  if (returnTo === "boot") reboot();
  else { showScreen("desktop"); startClock(); }
}

// ============================================================
// Reboot
// ============================================================
function reboot() {
  openWindows.forEach((w) => w.remove());
  openWindows.clear();
  refreshTaskbar();
  $("#start-menu").classList.add("hidden");
  const off = document.createElement("div");
  off.className = "power-off";
  $("#screen").appendChild(off);
  setTimeout(() => {
    off.remove();
    showScreen("boot-screen");
    runBoot();
  }, 700);
}

// ============================================================
// Window manager (XP/95 style)
// ============================================================
let zCounter = 100;
const openWindows = new Map();
let winSeq = 0;

function openWindow(id, title, bodyNode, opts = {}) {
  const existing = openWindows.get(id);
  if (existing) { focusWindow(existing); return existing; }
  const win = document.createElement("div");
  win.className = "window";
  win.dataset.id = id;
  const width = opts.width || 440;
  const height = opts.height || 320;
  const off = (winSeq++ % 5) * 26;
  win.style.width = width + "px";
  win.style.height = height + "px";
  win.style.left = Math.max(20, (window.innerWidth - width) / 2 - 60 + off) + "px";
  win.style.top = Math.max(20, (window.innerHeight - height) / 2 - 40 + off) + "px";
  win.style.zIndex = ++zCounter;

  win.innerHTML = `
    <div class="window-titlebar">
      <span class="window-title"></span>
      <button class="window-btn min" data-act="min" title="minimizar">_</button>
      <button class="window-btn close" data-act="close" title="cerrar">x</button>
    </div>
    <div class="window-body"></div>
  `;
  win.querySelector(".window-title").textContent = title;
  win.querySelector(".window-body").appendChild(bodyNode);
  $("#window-layer").appendChild(win);
  openWindows.set(id, win);
  refreshTaskbar();
  clickBeep();

  win.querySelector('[data-act="close"]').addEventListener("click", () => closeWindow(id));
  win.querySelector('[data-act="min"]').addEventListener("click", () => {
    win.style.display = "none";
    refreshTaskbar();
  });
  win.addEventListener("mousedown", () => focusWindow(win));
  makeDraggable(win, win.querySelector(".window-titlebar"));
  return win;
}

function focusWindow(win) {
  if (win.style.display === "none") win.style.display = "flex";
  win.style.zIndex = ++zCounter;
  refreshTaskbar();
}
function closeWindow(id) {
  const win = openWindows.get(id);
  if (!win) return;
  win.remove();
  openWindows.delete(id);
  refreshTaskbar();
  clickBeep();
}
function makeDraggable(win, handle) {
  let ox = 0, oy = 0, dragging = false;
  handle.addEventListener("mousedown", (e) => {
    if (e.target.closest(".window-btn")) return;
    dragging = true;
    const r = win.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    document.body.style.userSelect = "none";
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const x = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - ox));
    const y = Math.max(0, Math.min(window.innerHeight - 40, e.clientY - oy));
    win.style.left = x + "px";
    win.style.top = y + "px";
  });
  document.addEventListener("mouseup", () => {
    dragging = false;
    document.body.style.userSelect = "";
  });
}
function refreshTaskbar() {
  const bar = $("#task-windows");
  bar.innerHTML = "";
  openWindows.forEach((win) => {
    const btn = document.createElement("div");
    btn.className = "xp-task-win" + (win.style.display !== "none" ? " active" : "");
    btn.textContent = win.querySelector(".window-title").textContent;
    btn.addEventListener("click", () => focusWindow(win));
    bar.appendChild(btn);
  });
}

// ============================================================
// Cargar partida
// ============================================================
function openLoadWindow() {
  const body = document.createElement("div");
  body.className = "load-empty";
  const saves = getSaves();
  if (saves.length === 0) {
    body.innerHTML = `
      <div class="le-ico">▣</div>
      <div class="le-msg">No hay partidas guardadas</div>
      <div class="le-hint">Hilda y Pip aún no han guardado ningún progreso.</div>
      <div class="dialog-actions">
        <button class="xp-button" id="load-back">Volver</button>
      </div>
    `;
  } else {
    body.innerHTML = `<div class="le-msg">Partidas encontradas: ${saves.length}</div>`;
    saves.forEach((s, i) => {
      const row = document.createElement("div");
      row.textContent = `${i + 1}. ${s.name || "Partida"} — ${s.date || "?"}`;
      row.style.padding = "6px 0";
      row.style.borderBottom = "1px dotted #5a5240";
      body.appendChild(row);
    });
    const actions = document.createElement("div");
    actions.className = "dialog-actions";
    actions.innerHTML = `<button class="xp-button" id="load-back">Volver</button>`;
    body.appendChild(actions);
  }
  const win = openWindow("load", "Cargar partida — " + PROJECT_NAME, body, { width: 420, height: 280 });
  win.querySelector("#load-back").addEventListener("click", () => closeWindow("load"));
}

// ============================================================
// Configuración
// ============================================================
function openConfigWindow() {
  const body = document.createElement("div");

  // Sonido
  const soundField = document.createElement("div");
  soundField.className = "xp-fieldset";
  soundField.innerHTML = `<div class="xp-fieldset-legend">SONIDO</div>`;

  const soundRow = document.createElement("div");
  soundRow.className = "xp-row";
  soundRow.innerHTML = `<span class="xp-row-label">Efectos de sonido</span>`;
  const soundTg = makeToggle(settings.sound);
  soundTg.addEventListener("click", () => {
    settings.sound = !settings.sound;
    soundTg.classList.toggle("on", settings.sound);
    saveSettings();
    if (settings.sound) clickBeep();
  });
  soundRow.appendChild(soundTg);
  soundField.appendChild(soundRow);

  const volRow = document.createElement("div");
  volRow.className = "xp-row";
  volRow.innerHTML = `<span class="xp-row-label">Volumen</span>`;
  const sw = document.createElement("div");
  sw.style.display = "flex";
  sw.style.alignItems = "center";
  sw.style.gap = "8px";
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0"; slider.max = "100";
  slider.value = String(Math.round(settings.volume * 100));
  slider.className = "xp-slider";
  const volVal = document.createElement("span");
  volVal.className = "vol-value";
  volVal.textContent = slider.value + "%";
  slider.addEventListener("input", () => {
    settings.volume = Number(slider.value) / 100;
    volVal.textContent = slider.value + "%";
    saveSettings();
    if (settings.sound) beep(880, 0.03, "square", 0.2);
  });
  sw.appendChild(slider);
  sw.appendChild(volVal);
  volRow.appendChild(sw);
  soundField.appendChild(volRow);

  // Visual
  const fxField = document.createElement("div");
  fxField.className = "xp-fieldset";
  fxField.innerHTML = `<div class="xp-fieldset-legend">VISUAL</div>`;
  const fxRow = document.createElement("div");
  fxRow.className = "xp-row";
  fxRow.innerHTML = `<span class="xp-row-label">Efectos visuales (glitches / CRT)</span>`;
  const fxTg = makeToggle(settings.visualFx);
  fxTg.addEventListener("click", () => {
    settings.visualFx = !settings.visualFx;
    fxTg.classList.toggle("on", settings.visualFx);
    saveSettings();
    applyFxClass();
    if (settings.sound) clickBeep();
  });
  fxRow.appendChild(fxTg);
  fxField.appendChild(fxRow);

  body.appendChild(soundField);
  body.appendChild(fxField);

  const actions = document.createElement("div");
  actions.className = "dialog-actions";
  actions.innerHTML = `<button class="xp-button" id="cfg-back">Volver</button>`;
  body.appendChild(actions);

  const win = openWindow("config", "Configuración — " + PROJECT_NAME, body, { width: 460, height: 360 });
  win.querySelector("#cfg-back").addEventListener("click", () => closeWindow("config"));
}

function makeToggle(on) {
  const tg = document.createElement("div");
  tg.className = "xp-toggle" + (on ? " on" : "");
  tg.setAttribute("role", "switch");
  tg.setAttribute("aria-checked", String(on));
  tg.tabIndex = 0;
  tg.innerHTML = `<div class="xp-toggle-knob">${on ? "ON" : "OFF"}</div>`;
  const update = () => {
    tg.querySelector(".xp-toggle-knob").textContent = tg.classList.contains("on") ? "ON" : "OFF";
    tg.setAttribute("aria-checked", String(tg.classList.contains("on")));
  };
  new MutationObserver(update).observe(tg, { attributes: true, attributeFilter: ["class"] });
  return tg;
}

// ============================================================
// Nueva partida (provisional)
// ============================================================
function openNewGameWindow() {
  const body = document.createElement("div");
  body.className = "load-empty";
  body.innerHTML = `
    <div class="le-ico">✦</div>
    <div class="le-msg">Iniciando nueva partida...</div>
    <div class="le-hint">Hilda y Pip se preparan para entrar al sistema.</div>
    <div class="dialog-actions">
      <button class="xp-button" id="new-back">Volver</button>
    </div>
  `;
  const win = openWindow("newgame", "Nueva partida — " + PROJECT_NAME, body, { width: 420, height: 280 });
  win.querySelector("#new-back").addEventListener("click", () => closeWindow("newgame"));
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ============================================================
// Wiring
// ============================================================
$("#btn-new").addEventListener("click", () => { ensureAudio(); openNewGameWindow(); });
$("#btn-load").addEventListener("click", () => { ensureAudio(); openLoadWindow(); });
$("#btn-config").addEventListener("click", () => { ensureAudio(); openConfigWindow(); });

$("#start-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#start-menu").classList.toggle("hidden");
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("#start-menu") && !e.target.closest("#start-btn")) {
    $("#start-menu").classList.add("hidden");
  }
});
$("#start-menu").addEventListener("click", (e) => {
  const item = e.target.closest(".xp-sm-item");
  if (!item) return;
  const app = item.dataset.app;
  $("#start-menu").classList.add("hidden");
  ensureAudio();
  switch (app) {
    case "load": openLoadWindow(); break;
    case "config": openConfigWindow(); break;
    case "bsod": triggerBsod("desktop"); break;
    case "reboot": reboot(); break;
  }
});

function unlockAudioOnce() {
  ensureAudio();
  document.removeEventListener("pointerdown", unlockAudioOnce);
  document.removeEventListener("keydown", unlockAudioOnce);
}
document.addEventListener("pointerdown", unlockAudioOnce);
document.addEventListener("keydown", unlockAudioOnce);

// ============================================================
// Init
// ============================================================
applyFxClass();
runBoot();
