# ✨ Charm Booth

A desktop‑first web camera app with real‑time pastel filters, animated charms, countdown capture, photo gallery, and 3–5s video clips.

## Features
- Live camera preview with pastel filters  
- Animated charms (hearts, sparkles, bubbles, stars, flowers)  
- Countdown photo capture with gallery  
- 3–5s clip recording using MediaRecorder  
- Mirror toggle + camera restart  
- Desktop‑first UI with responsive layout  

## Tech Stack
- React (CDN)  
- HTML5 Canvas  
- getUserMedia + MediaRecorder  
- Tailwind (via CDN)  

## Run locally
Camera access requires a secure context, so use localhost:

```bash
cd /Users/niharikakanwar/snap
python3 -m http.server 5173
```

Then open `http://localhost:5173` in your browser.
