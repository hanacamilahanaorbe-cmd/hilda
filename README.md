# hilda.log

Portátil infectado con malware. Dirección de arte **pixel-art retro /
cyberpunk / Windows XP-95 + malware de los 2000s** con efectos CRT.
Construido con HTML, CSS y JavaScript plano. Sin contraseñas, sin backend,
sin cuentas.

## Concepto (GDD)

`hilda.log` es la pantalla del portátil infectado con malware de **Hilda**,
una estudiante de 25 años. Su versión digital (`.jpg`) y **Pip** (el cursor
del mouse) están atrapados dentro del sistema operativo retro (Windows XP /
95) intentando salvar sus archivos antes de que sean borrados por los
virus: **MEMENTO.EXE**, **ANEMONIA.CMD** y **COOLDRAKE.HTML**.

**Subtítulo**: «¿Qué habita realmente dentro de tu computadora?»
**Etiqueta**: `sistema infectado // malware detectado`

## Características

- **Arranque TTY en español** — texto monoespaciado carácter por carácter
  con cursor parpadeante dentro de una ventana con barra de título neón:
  - `CARGANDO hilda.log...`
  - `DETECTANDO MALWARE EN SISTEMA OPERATIVO...`
  - `ESCANEAR PAPELERA, ARCHIVOS E INTERNET...`
  - `ERROR: MEMENTO.EXE, ANEMONIA.CMD Y COOLDRAKE.HTML DETECTADOS`
  - `RECUPERANDO ESCRITORIO DE HILDA...`
  - `hilda.log INICIADO CON ERRORES CRÍTICOS.`
- **Sin contraseña** — entra directamente al escritorio.
- **Estética malware / Windows XP-95** — monitor CRT con bisel, biseles 3D
  pixel-art, fondo de motherboard con cables, chips, bloques glitch y
  símbolos de virus (☣ ☠ ⚠). Fuentes `Press Start 2P` + `VT323` pixelated.
- **Paleta** — cian neón `#00ffff`, verde terminal `#00ff66`, magenta,
  púrpura, amber, rojo de amenaza y azul BSOD, sobre beige industrial.
- **Menú principal (2 botones)** dentro de una ventana XP con bisel 3D y
  esquinas neón rojo:
  - **CARGAR PARTIDA** — ventana «No hay partidas guardadas» + Volver.
  - **CONFIGURACIÓN** — interruptores pixel ON/OFF para sonido y efectos
    visuales, slider de volumen, botón Volver. Persiste en `localStorage`.
- **BSOD integrada** — azul profundo, texto blanco monoespaciado en
  español: `SE HA DETECTADO UN ERROR INESPERADO EN hilda.log`,
  `AMENAZA DE MALWARE CRÍTICA...`, `REVISANDO PAPELERA DE RECICLAJE Y
  FOTOGRAFÍAS...`, barra de progreso 0→100% con relleno neón, glitches y
  regreso automático al escritorio.
- **Ícono SEÑAL** en el escritorio — abre archivos corruptos con fragmentos
  del lore (foto de Hilda, papelera, COOLDRAKE.html). A veces dispara BSOD.
- **Ventanas XP/95** — barras de título degradadas, botones `[X]` y `[_]`
  funcionales, biseles 3D, arrastrables, barra de tareas con reloj.
- **Audio** — pitidos generados con Web Audio API (sin archivos externos).

## Cómo ejecutarlo

```bash
npm install
npm run dev      # abre http://localhost:5173
```

Versión estática:

```bash
npm run build    # genera dist/
npm run preview  # sirve dist/
```

`dist/` es autónomo y funciona offline.

## Integración en GDevelop

1. `npm run build`.
2. Copia `dist/` dentro del proyecto de GDevelop.
3. Añade un objeto **WebView / elemento HTML** apuntando a
   `assets/dist/index.html`.
4. Tamaño 1280×720 sobre una escena 16:9.

## Archivos

```
index.html   — monitor CRT, backdrop malware/motherboard, arranque, BSOD, escritorio
style.css    — pixel-art / neón / XP-95 / BSOD / efectos CRT
main.js      — arranque, BSOD, ventanas, configuración, audio, archivos corruptos
```
